import { NextResponse } from 'next/server';
import { connectDB, Property } from '@/lib/db';

export const dynamic = 'force-dynamic';

// One-time migration: the properties collection has a legacy unique index on
// propertyId alone, which blocks giving multiple users their own copy of the
// same baseline property. Replace it with a compound unique index on
// (propertyId, userId) instead. Safe to re-run.
export async function POST() {
  try {
    await connectDB();
    const collection = Property.collection;

    const indexes = await collection.indexes();
    const before = indexes.map((i) => i.name);

    const legacy = indexes.find(
      (i) => i.key && Object.keys(i.key).length === 1 && i.key.propertyId === 1 && i.unique
    );
    if (legacy?.name) {
      await collection.dropIndex(legacy.name);
    }

    await collection.createIndex(
      { propertyId: 1, userId: 1 },
      { unique: true, name: 'propertyId_userId_unique' }
    );

    const after = (await collection.indexes()).map((i) => i.name);
    return NextResponse.json({ success: true, droppedLegacy: !!legacy, before, after });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
