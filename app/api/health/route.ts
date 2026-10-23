import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import crypto from 'crypto';

/**
 * One URL that says what is actually running: which build, and a fingerprint
 * of which database it talks to. Production turned out to be reading a
 * different MongoDB than local testing (its own MONGODB_URI env), and nobody
 * could tell — "where did my properties go" was two environments looking at
 * two databases. The db hash identifies the cluster without leaking the URI.
 */
export async function GET() {
  let db = 'unreachable';
  try {
    await connectDB();
    const host = mongoose.connection.host || 'unknown';
    db = `${crypto.createHash('sha256').update(host).digest('hex').slice(0, 8)} (${host.split('.')[0]})`;
  } catch {
    // Reported as unreachable below.
  }
  return NextResponse.json({
    ok: db !== 'unreachable',
    build: process.env.NEXT_PUBLIC_BUILD_ID || 'dev',
    db,
  });
}
