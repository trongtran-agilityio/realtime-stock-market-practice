import { Document, Schema, model, models } from "mongoose";

/**
 * Watchlist Item Interface
 * Represents a stock symbol saved to a user's watchlist
 */
export interface WatchlistItem extends Document {
  userId: string;   // ID of the user who added the symbol
  symbol: string;   // Stock ticker symbol (always uppercase)
  company: string;  // Company name
  addedAt: Date;    // When this symbol was added to the watchlist

  // Optional snapshot metrics (faked/randomized for UI display)
  price?: number;
  change?: number;      // daily change percentage
  marketCap?: number;   // in USD
  peRatio?: number;     // price-to-earnings ratio
}

/**
 * Watchlist Schema Definition
 * Features:
 * - Compound index for unique symbols per user
 * - Automatic uppercase conversion for symbols
 * - Timestamp tracking for when items are added
 */
const WatchlistSchema = new Schema<WatchlistItem>(
  {
    userId: { type: String, required: true, index: true },
    symbol: { type: String, required: true, uppercase: true, trim: true },
    company: { type: String, required: true, trim: true },
    addedAt: { type: Date, default: Date.now },
    price: { type: Number, default: () => +(50 + Math.random() * 450).toFixed(2) },
    change: { type: Number, default: () => +((-5 + Math.random() * 10).toFixed(2)) },
    marketCap: { type: Number, default: () => Math.floor(1e9 + Math.random() * 999e9) },
    peRatio: { type: Number, default: () => +(5 + Math.random() * 35).toFixed(2) },
  },
  { timestamps: false }
);

// Compound unique index to prevent duplicate symbols per user
WatchlistSchema.index({ userId: 1, symbol: 1 }, { unique: true });

// Use the models?.Watchlist || model pattern to prevent OverwriteModelError in dev/hot-reload
export const Watchlist = models?.Watchlist || model<WatchlistItem>('Watchlist', WatchlistSchema);

export default Watchlist;
