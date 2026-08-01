import { NextResponse } from 'next/server';
import { connectDB, Property, User } from '@/lib/db';
import { DEFAULT_PROPERTIES } from '@/lib/defaultProperties';

// One-time (idempotent) seed that gives every existing inspector their own real
// copy of the baseline properties — created the same way a manually-added
// property is (tied to that user's own userId), not a shared/global record.
// Safe to re-run: upserts on (propertyId, userId), never duplicates.
export async function POST() {
  try {
    await connectDB();

    // Clean up the earlier shared (userId: null) copies from a prior attempt —
    // those were replaced by real per-user copies below.
    const defaultIds = DEFAULT_PROPERTIES.map((p) => p.propertyId);
    await Property.deleteMany({ propertyId: { $in: defaultIds }, userId: null });

    const users = await User.find({}, { _id: 1 }).lean();

    let upserted = 0;
    for (const user of users) {
      const userId = String((user as any)._id);
      for (const p of DEFAULT_PROPERTIES) {
        await Property.findOneAndUpdate(
          { propertyId: p.propertyId, userId },
          { $set: { ...p, userId, status: 'active' } },
          { upsert: true, new: true }
        );
        upserted++;
      }
    }

    return NextResponse.json({ success: true, users: users.length, propertiesPerUser: DEFAULT_PROPERTIES.length, upserted });
  } catch (error: any) {
    console.error('POST /api/seed-default-properties error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
