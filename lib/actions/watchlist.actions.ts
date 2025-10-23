'use server';

import { connectToDatabase } from "@/database/mongoose";
import Watchlist from "@/database/models/watchlist.model";

/**
 * Resolve Better Auth user id from email
 */
const getUserIdByEmail = async (email: string): Promise<string | null> => {
  if (!email) return null;
  const mongoose = await connectToDatabase();
  const db = mongoose.connection.db;
  if (!db) throw new Error('MongoDB connection not found.');
  const user = await db
    .collection('user')
    .findOne<{ _id?: unknown; id?: string; email?: string }>({ email });
  if (!user) return null;
  return (user.id || user._id?.toString() || null) as string | null;
};

/**
 * Fetch watchlist symbols for a user
 * @param email User's email address
 * @returns Array of stock symbols in user's watchlist
 * 
 * Note: Uses Better Auth's user collection instead of a dedicated User model
 * Returns empty array on any error or if user not found
 */
export const getWatchlistSymbolsByEmail = async (email: string): Promise<string[]> => {
  if (!email) return [];

  try {
    const userId = await getUserIdByEmail(email);
    if (!userId) return [];

    // Query Watchlist items by userId and return symbols only
    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
    return items.map((i) => String(i.symbol));

  } catch (e) {
    console.error('Error fetching watchlist symbols by email:', e);
    return [];
  }
};

/**
 * Get user's watchlist (no metrics)
 * Returns only persistent fields from DB; UI will generate metrics per view.
 */
export const getWatchlistByEmail = async (email: string) => {
  try {
    const userId = await getUserIdByEmail(email);
    if (!userId) return [];
    const items = await Watchlist.find({ userId }).lean();
    return items.map((i) => ({
      id: String(i._id),
      symbol: String(i.symbol),
      company: String(i.company),
      addedAt: i.addedAt,
    }));
  } catch (e) {
    console.error('Error fetching watchlist by email:', e);
    return [];
  }
};

/** Add a symbol to watchlist */
export const addToWatchlist = async (email: string, symbol: string, company: string) => {
  try {
    const userId = await getUserIdByEmail(email);
    if (!userId) throw new Error('User not found');
    // Upsert to avoid duplicates and to fill in new metrics if needed
    const doc = await Watchlist.findOneAndUpdate(
      { userId, symbol: symbol.toUpperCase() },
      {
        $setOnInsert: {
          userId,
          symbol: symbol.toUpperCase(),
          company,
          addedAt: new Date(),
        },
      },
      { upsert: true, new: true }
    ).lean();

    return { ok: true, item: doc } as const;
  } catch (e) {
    console.error('Error adding to watchlist:', e);
    return { ok: false } as const;
  }
};

/** Remove a symbol from watchlist */
export const removeFromWatchlist = async (email: string, symbol: string) => {
  try {
    const userId = await getUserIdByEmail(email);
    if (!userId) throw new Error('User not found');
    await Watchlist.deleteOne({ userId, symbol: symbol.toUpperCase() });
    return { ok: true } as const;
  } catch (e) {
    console.error('Error removing from watchlist:', e);
    return { ok: false } as const;
  }
};

/** Toggle a symbol in watchlist */
export const toggleWatchlist = async (email: string, symbol: string, company: string) => {
  const userId = await getUserIdByEmail(email);
  if (!userId) return { ok: false } as const;
  const exists = await Watchlist.exists({ userId, symbol: symbol.toUpperCase() });
  if (exists) {
    await Watchlist.deleteOne({ userId, symbol: symbol.toUpperCase() });
    return { ok: true, action: 'removed' as const };
  } else {
    await Watchlist.create({ userId, symbol: symbol.toUpperCase(), company });
    return { ok: true, action: 'added' as const };
  }
};
