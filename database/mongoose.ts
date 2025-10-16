// Singleton MongoDB connection helper using Mongoose
// ---------------------------------------------------
// This module implements a safe, process-wide singleton connection pattern for
// Mongoose. In environments like Next.js (especially with hot reloading in
// development and serverless-like execution), modules can be re-evaluated many
// times. Without a cache, each import could create a new database connection,
// quickly exhausting connection pools.
//
// How it works:
// - We store a small cache (connection and the connection promise) on the Node
//   global object to persist across module reloads within the same process.
// - The first call initializes the connection promise; subsequent calls reuse it
//   until it resolves, after which the resolved connection is reused.
// - This avoids creating multiple concurrent connections while still allowing
//   callers to simply `await connectToDatabase()` anywhere in the codebase.
//
// Usage:
//   import { connectToDatabase } from "@/database/mongoose";
//   const conn = await connectToDatabase();
//   // use mongoose.models / mongoose.connection thereafter
//
// Note:
// - Requires MONGODB_URI to be defined in the environment (.env).
// - bufferCommands is disabled so that models fail fast if used before connect.

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Augment the Node.js global type to include a cache for the Mongoose
 * connection so that we can safely reuse it across hot reloads and multiple
 * imports within the same process.
 */
declare global {
  var mongooseCache: {

    /** The resolved Mongoose connection once established. */
    conn: typeof mongoose | null;

    /** A single in-flight promise for establishing the connection. */
    promise: Promise<typeof mongoose> | null;
  }
}

// Reuse an existing cache if present (e.g., after a hot reload), otherwise create it.
let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

/**
 * Establish (or retrieve) a singleton Mongoose connection.
 * - If a connection already exists, returns it immediately.
 * - If a connection is in-flight, awaits and returns the same promise.
 * - Otherwise, starts a new connection and caches both the promise and result.
 */
export const connectToDatabase = async (): Promise<typeof mongoose> => {
  if (!MONGODB_URI)
    throw new Error("MONGODB_URI must be set within .env");

  // Return the already established connection if available
  if (cached.conn)
    return cached.conn;

  // Create a single shared connection promise if not already in-flight
  if (!cached.promise)
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    // Reset the promise so future calls can retry
    cached.promise = null;
    throw err;
  }

  // Be chatty only outside production
  if (process.env.NODE_ENV !== "production") {
    console.log(`Connected to database (${process.env.NODE_ENV})`);
  }

  return cached.conn;
}