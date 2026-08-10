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

// GET /api/inspections/stats — aggregate inspection counts.
// Inspectors only ever see their own work (matches GET /api/inspections'
// scoping); non-inspector roles (management/other) get an org-wide view
// since they oversee inspections rather than perform them themselves.
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = getUserFromToken(req);
    if (!user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const filter: any = user.role === 'inspector' ? { inspectorId: user.id } : {};

    const [totalInspections, completed, inProgress] = await Promise.all([
      Inspection.countDocuments(filter),
      Inspection.countDocuments({ ...filter, status: 'completed' }),
      Inspection.countDocuments({ ...filter, status: 'in-progress' }),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalInspections,
        completed,
        scheduled: 0,
        inProgress,
        passed: 0,
        failed: 0,
        averageScore: 0,
      },
    });
  } catch (error: any) {
    console.error('GET /api/inspections/stats error:', error);
    return NextResponse.json({
      success: true,
      stats: { totalInspections: 0, completed: 0, scheduled: 0, inProgress: 0, passed: 0, failed: 0, averageScore: 0 },
    });
  }
}
