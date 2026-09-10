import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Inspection } from '@/lib/db';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'inspire_jwt_secret_key_2024';

// Called when an inspector finishes an inspection and exports the report. The
// route was referenced but never implemented, and the caller swallows the
// failure so the export looked successful while nothing was recorded.

function getUserFromToken(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth) return null;
  try {
    return jwt.verify(auth.replace('Bearer ', ''), JWT_SECRET) as any;
  } catch {
    return null;
  }
}

const toObjectId = (value: unknown) =>
  typeof value === 'string' && mongoose.Types.ObjectId.isValid(value)
    ? new mongoose.Types.ObjectId(value)
    : null;

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const user = getUserFromToken(req);
    if (!user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // Two callers with different shapes: the summary screen sends
    // { propertyId, inspectionData }, the api helper sends { property_id, ... }.
    const rawPropertyId = body.propertyId ?? body.property_id;
    const propertyId = toObjectId(rawPropertyId);
    if (!propertyId) {
      return NextResponse.json({ success: false, message: 'A valid property id is required.' }, { status: 400 });
    }

    const inspectionData = body.inspectionData ?? body.data ?? body;
    const status = typeof inspectionData?.status === 'string' ? inspectionData.status : 'completed';
    const inspectorId = toObjectId(user.id);

    // Finishing the same property twice should update that inspector's record
    // rather than pile up duplicates.
    const existing = await Inspection.findOne({ propertyId, inspectorId }).sort({ createdAt: -1 });

    if (existing) {
      existing.inspectionData = inspectionData;
      existing.status = status;
      existing.completedAt = new Date();
      await existing.save();
      return NextResponse.json({ success: true, message: 'Inspection updated', inspection: existing });
    }

    // inspectionId carries a unique index, so every insert needs its own value
    // or the second document ever written collides on null.
    const inspection = await Inspection.create({
      inspectionId: `INS-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
      propertyId,
      inspectorId,
      inspectionType: inspectionData?.inspectionType || body.inspectionType,
      unitId: inspectionData?.unitId || body.unitId,
      buildingId: inspectionData?.buildingId || body.buildingId,
      status,
      inspectionData,
      completedAt: new Date(),
    });

    return NextResponse.json({ success: true, message: 'Inspection saved', inspection }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/inspections/complete error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to save inspection.' }, { status: 500 });
  }
}
