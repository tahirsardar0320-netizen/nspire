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

// GET /api/inspections — list inspections
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = getUserFromToken(req);
    if (!user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const propertyId = searchParams.get('property');
    const status = searchParams.get('status');

    const filter: any = { inspectorId: user.id };
    if (propertyId) {
      filter.propertyId = propertyId;
    }
    if (status) {
      filter.status = status;
    }

    const inspections = await Inspection.find(filter)
      .populate('propertyId')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, inspections });
  } catch (error: any) {
    console.error('GET /api/inspections error:', error);
    return NextResponse.json({ success: true, inspections: [] });
  }
}

// POST /api/inspections — create/save inspection
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = getUserFromToken(req);
    const body = await req.json();

    const inspection = await Inspection.create({
      ...body,
      inspectorId: user?.id || null,
    });

    return NextResponse.json({
      success: true,
      message: 'Inspection saved',
      inspection,
    }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/inspections error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
