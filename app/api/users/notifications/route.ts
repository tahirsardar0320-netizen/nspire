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

// PUT /api/users/notifications — update the authenticated user's notification preferences
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const decoded = getUserFromToken(req);
    if (!decoded?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { emailNotifications, inAppNotifications } = await req.json();
    const update: Record<string, any> = {};
    if (emailNotifications !== undefined) update.emailNotifications = emailNotifications;
    if (inAppNotifications !== undefined) update.inAppNotifications = inAppNotifications;

    const user = await User.findByIdAndUpdate(decoded.id, { $set: update }, { new: true }).select('-password');
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Notification settings updated successfully' });
  } catch (error: any) {
    console.error('PUT /api/users/notifications error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to update notification settings' }, { status: 500 });
  }
}
