'use server';

import { connectToDatabase } from "@/database/mongoose";
import Watchlist from "@/database/models/watchlist.model";

// Return only the watchlist symbols (uppercase strings) for a given user email.
// - Uses Better Auth's `user` collection (no dedicated User model)
// - Fails gracefully by returning an empty array on any error or missing user
export const getWatchlistSymbolsByEmail = async (email: string): Promise<string[]> => {
  if (!email) return [];

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found.');

    // Find the user by email in the Better Auth "user" collection
    const user = await db
      .collection('user')
      .findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

    if (!user) return [];

    const userId: string | undefined = user.id || user._id?.toString();
    if (!userId) return [];

    // Query Watchlist items by userId and return symbols only
    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
    return items.map((i) => String(i.symbol));

  } catch (e) {
    console.error('Error fetching watchlist symbols by email:', e);
    return [];
  }
};
