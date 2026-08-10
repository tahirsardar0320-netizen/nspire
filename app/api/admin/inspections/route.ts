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

// GET /api/admin/inspections — org-wide inspection list for the Management Reports page.
// Unlike GET /api/inspections (scoped to the requesting inspector), this returns
// every inspector's records since management needs to see all activity.
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = getUserFromToken(req);
    if (!user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search')?.toLowerCase().trim();
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '20'));

    const filter: any = {};
    if (status) filter.status = status;

    const records = await Inspection.find(filter)
      .select('propertyId inspectorId unitId status completedAt createdAt')
      .populate('propertyId', 'name')
      .populate('inspectorId', 'fullName')
      .sort({ createdAt: -1 })
      .lean();

    let inspections = records.map((r: any) => ({
      _id: r._id,
      propertyName: r.propertyId?.name || '',
      property: r.propertyId ? { _id: r.propertyId._id, name: r.propertyId.name } : undefined,
      unit: r.unitId ? { _id: r.unitId, unitNumber: r.unitId } : undefined,
      inspector: r.inspectorId ? { _id: r.inspectorId._id, name: r.inspectorId.fullName } : undefined,
      inspectorName: r.inspectorId?.fullName || '',
      scheduledDate: r.createdAt,
      inspectionDate: r.completedAt || r.createdAt,
      status: r.status,
    }));

    if (search) {
      inspections = inspections.filter((i) =>
        (i.propertyName || '').toLowerCase().includes(search) ||
        (i.inspectorName || '').toLowerCase().includes(search)
      );
    }

    const total = inspections.length;
    const start = (page - 1) * limit;
    const paged = inspections.slice(start, start + limit);

    return NextResponse.json({
      success: true,
      inspections: paged,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    });
  } catch (error: any) {
    console.error('GET /api/admin/inspections error:', error);
    return NextResponse.json({ success: true, inspections: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 1 } });
  }
}
