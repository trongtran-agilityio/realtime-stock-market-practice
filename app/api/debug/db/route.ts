/**
 * For testing database connection purpose.
 * Example: enter http://localhost:3001/api/debug/db on browser
 */
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/database/mongoose";

export const dynamic = "force-dynamic"; // ensure no caching in dev/prod

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

export async function GET() {
  try {
    await connectToDatabase();

    const conn = mongoose.connection;
    const redactedUri = process.env.MONGODB_URI?.replace(/\/\/(.*?):.*?@/, "//$1:<redacted>@");

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
    return NextResponse.json({
      ok: false,
      error: error?.message || String(error),
      now: new Date().toISOString(),
    }, { status: 500 });
  }
}