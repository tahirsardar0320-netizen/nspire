import { NextRequest, NextResponse } from 'next/server';
import { connectDB, User } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'inspire_jwt_secret_key_2024';

// Directory of accounts, used by the management analytics page to list
// inspectors. It was calling this route before it existed, so the inspector
// panel stayed empty and the page 404'd on every load.

function getUserFromToken(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth) return null;
  try {
    return jwt.verify(auth.replace('Bearer ', ''), JWT_SECRET) as any;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // This lists other people's accounts, so it stays behind a valid session.
    const decoded = getUserFromToken(req);
    if (!decoded?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = req.nextUrl;
    const role = (searchParams.get('role') || '').trim();
    const search = (searchParams.get('search') || '').trim();
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const limit = Math.min(200, Math.max(1, parseInt(searchParams.get('limit') || '100', 10) || 100));

    const query: Record<string, any> = {};
    if (role) query.role = role;

    if (search) {
      // Escape the input so a stray regex character can't change the query.
      const safe = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { fullName: { $regex: safe, $options: 'i' } },
        { email: { $regex: safe, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('fullName email role inspectorType phone isActive lastLogin createdAt')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      success: true,
      users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    console.error('GET /api/users error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to load users' }, { status: 500 });
  }
}
