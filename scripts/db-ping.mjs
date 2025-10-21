#!/usr/bin/env node
import 'dotenv/config';
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('ERROR: MONGODB_URI must be set in .env');
  process.exit(1);
}

const start = Date.now();

try {
  const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  // Optional ping command against admin database
  try {
    await conn.connection.db.admin().command({ ping: 1 });
  } catch (_) {
    // ignore if admin ping not allowed
  }
  const ms = Date.now() - start;
  const redacted = uri.replace(/\/\/(.*?):.*?@/, '//$1:<redacted>@');
  console.log(JSON.stringify({ ok: true, ms, dbName: conn.connection.name, host: conn.connection.host, uri: redacted }, null, 2));
  await mongoose.disconnect();
  process.exit(0);
} catch (err) {
  const ms = Date.now() - start;
  console.error(JSON.stringify({ ok: false, ms, error: err?.message || String(err) }, null, 2));
  try { await mongoose.disconnect(); } catch { }
  process.exit(2);
}