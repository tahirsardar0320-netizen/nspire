import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Inspection } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'inspire_jwt_secret_key_2024';

function getUserFromToken(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth) return null;
  const token = auth.replace('Bearer ', '');
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch {
    return null;
  }
}

// GET /api/inspections/progress — get inspection progress
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = getUserFromToken(req);
    if (!user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized', progress: [] }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const propertyId = searchParams.get('property_id') || searchParams.get('propertyId');

    const filter: any = { inspectorId: user.id };
    if (propertyId) {
      filter.propertyId = propertyId;
    }

    const progress = await Inspection.find(filter)
      .select('propertyId inspectionType unitId buildingId status responses inspectionData data')
      .lean();

    return NextResponse.json({ success: true, progress });
  } catch (error: any) {
    console.error('GET /api/inspections/progress error:', error);
    return NextResponse.json({ success: true, progress: [] });
  }
}

// POST /api/inspections/progress — save/update inspection progress (upsert)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = getUserFromToken(req);
    if (!user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const propertyId = body.property_id || body.propertyId;
    const inspectionType = body.inspection_type || body.inspectionType;
    const buildingId = body.building_id || body.buildingId;
    const unitId = body.unit_id || body.unitId;

    if (!propertyId || !inspectionType) {
      return NextResponse.json({ success: false, message: 'property_id and inspection_type are required' }, { status: 400 });
    }

    const isComplete = !!body.inspectionData?.isComplete;

    const filter = {
      propertyId,
      inspectorId: user.id,
      inspectionType,
      buildingId: buildingId || null,
      unitId: unitId || null,
    };

    const update = {
      $set: {
        responses: body.responses,
        inspectionData: body.inspectionData,
        status: isComplete ? 'completed' : 'in-progress',
        ...(isComplete ? { completedAt: new Date() } : {}),
      },
    };

    const record = await Inspection.findOneAndUpdate(filter, update, { upsert: true, new: true });

    return NextResponse.json({ success: true, msg: 'Progress saved', buildingInspectionId: record._id });
  } catch (error: any) {
    console.error('POST /api/inspections/progress error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to save progress' }, { status: 500 });
  }
}
