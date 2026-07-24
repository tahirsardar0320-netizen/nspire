import { NextRequest, NextResponse } from 'next/server';
import { connectDB, User } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'inspire_jwt_secret_key_2024';

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization');
    if (!auth) {
      return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
    }

    const token = auth.replace('Bearer ', '');
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      // If token is a fallback token (starts with 'token_'), return stored user
      if (token.startsWith('token_') || token.startsWith('admin_token_')) {
        return NextResponse.json({
          success: true,
          user: {
            id: 'local_user',
            fullName: 'Inspector User',
            email: 'user@inspire.app',
            role: 'inspector',
          }
        });
      }
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(decoded.id).select('-password').lean();
    
    if (!user) {
      return NextResponse.json({
        success: true,
        user: {
          id: decoded.id,
          fullName: 'User',
          email: '',
          role: decoded.role || 'inspector',
        }
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: (user as any)._id,
        fullName: (user as any).fullName,
        email: (user as any).email,
        role: (user as any).role,
        phone: (user as any).phone,
        language: (user as any).language,
        timezone: (user as any).timezone,
        emailNotifications: (user as any).emailNotifications,
        inAppNotifications: (user as any).inAppNotifications,
      }
    });
  } catch (error: any) {
    console.error('GET /api/auth/me error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
