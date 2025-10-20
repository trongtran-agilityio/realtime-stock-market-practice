import { Document, Schema, model, models } from "mongoose";

// Watchlist item interface representing a single document in the collection
export interface WatchlistItem extends Document {
  userId: string;   // ID of the user who added the symbol
  symbol: string;   // Stock ticker symbol (always uppercase)
  company: string;  // Company name
  addedAt: Date;    // When this symbol was added to the watchlist
}

// Mongoose schema for the Watchlist collection
const WatchlistSchema = new Schema<WatchlistItem>(
  {
    userId: { type: String, required: true, index: true },
    symbol: { type: String, required: true, uppercase: true, trim: true },
    company: { type: String, required: true, trim: true },
    addedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

// Compound unique index to prevent duplicate symbols per user
WatchlistSchema.index({ userId: 1, symbol: 1 }, { unique: true });

// Use the models?.Watchlist || model pattern to prevent OverwriteModelError in dev/hot-reload
export const Watchlist = models?.Watchlist || model<WatchlistItem>('Watchlist', WatchlistSchema);

export default Watchlist;
