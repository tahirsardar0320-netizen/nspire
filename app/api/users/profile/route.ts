import { NextRequest, NextResponse } from 'next/server';
import { connectDB, User } from '@/lib/db';
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

// PUT /api/users/profile — update the authenticated user's profile
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const decoded = getUserFromToken(req);
    if (!decoded?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const update: Record<string, any> = {};
    for (const field of ['fullName', 'email', 'phone', 'role', 'language', 'timezone']) {
      if (body[field] !== undefined) update[field] = body[field];
    }

    const user = await User.findByIdAndUpdate(decoded.id, update, { new: true }).select('-password');
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Profile updated successfully', user });
  } catch (error: any) {
    console.error('PUT /api/users/profile error:', error);
    if (error.code === 11000) {
      return NextResponse.json({ success: false, message: 'Email is already in use' }, { status: 409 });
    }
    return NextResponse.json({ success: false, message: error.message || 'Failed to update profile' }, { status: 500 });
  }
}
