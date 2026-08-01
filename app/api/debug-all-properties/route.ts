import { NextResponse } from 'next/server';
import { connectDB, Property } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Temporary admin-only listing used once to identify stale test properties for
// cleanup. Remove after use.
export async function GET() {
  try {
    await connectDB();
    const properties = await Property.find({}).lean();
    return NextResponse.json({ success: true, properties });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
