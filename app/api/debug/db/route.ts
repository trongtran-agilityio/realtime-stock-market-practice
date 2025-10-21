/**
 * Database Connection Debug API Route
 * Access via: http://localhost:3001/api/debug/db
 * Purpose: Verify and display MongoDB connection status
 */
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/database/mongoose";

// Disable response caching to ensure real-time connection status
export const dynamic = "force-dynamic";

/**
 * Convert Mongoose connection state number to readable string
 * @param state MongoDB connection state code
 * @returns Human-readable connection state
 */
const stateLabel = (state: number) => {
  switch (state) {
    case 0: return "disconnected";
    case 1: return "connected";
    case 2: return "connecting";
    case 3: return "disconnecting";
    case 99: return "uninitialized";
    default: return `unknown(${state})`;
  }
};

/**
 * GET handler for database connection status
 * Returns connection details while protecting sensitive credentials
 */
export async function GET() {
  try {
    // Attempt database connection
    await connectToDatabase();

    const conn = mongoose.connection
    // Redact password from connection URI for security
    const redactedUri = process.env.MONGODB_URI?.replace(/\/\/(.*?):.*?@/, "//$1:<redacted>@");

    // Prepare connection status response
    const payload = {
      ok: true,
      readyState: conn.readyState,
      state: stateLabel(conn.readyState),
      dbName: conn.name,
      host: (conn as any).host || conn.client?.s?.url || undefined,
      uri: redactedUri,
      now: new Date().toISOString(),
    };

    return NextResponse.json(payload, { status: 200 });
  } catch (error: any) {
    // Return error details if connection fails
    return NextResponse.json({
      ok: false,
      error: error?.message || String(error),
      now: new Date().toISOString(),
    }, { status: 500 });
  }
}