import { NextRequest, NextResponse } from 'next/server';
import { connectDB, User, Property, Inspection } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'inspire_jwt_secret_key_2024';

// Account deletion, linked from /dashboard/delete-account and published to the
// app stores as the account-deletion route. It was referenced but never
// implemented, so the button 404'd and nothing was ever deleted.

function getUserFromToken(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth) return null;
  try {
    return jwt.verify(auth.replace('Bearer ', ''), JWT_SECRET) as any;
  } catch {
    return null;
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const decoded = getUserFromToken(req);
    if (!decoded?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { password } = await req.json().catch(() => ({ password: undefined }));

    // Only ever the caller's own account — the id comes from the signed token,
    // never from the request body.
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Account not found.' }, { status: 404 });
    }

    // Deletion is irreversible, so re-confirm the password before proceeding.
    // Social sign-ups have no password stored and cannot be challenged this way.
    if (user.password) {
      if (!password) {
        return NextResponse.json({ success: false, message: 'Password is required to delete your account.' }, { status: 400 });
      }
      const matches = await bcrypt.compare(password, user.password);
      if (!matches) {
        return NextResponse.json({ success: false, message: 'Incorrect password.' }, { status: 401 });
      }
    }

    const userId = String(user._id);

    // Remove the account's data too — the stores were told deletion removes it,
    // so leaving these behind would make that untrue.
    const [properties, inspections] = await Promise.all([
      Property.deleteMany({ userId }),
      Inspection.deleteMany({ inspectorId: user._id }),
    ]);
    await User.findByIdAndDelete(user._id);

    console.log(`🗑️  Account deleted: ${user.email} (properties: ${properties.deletedCount}, inspections: ${inspections.deletedCount})`);

    return NextResponse.json({
      success: true,
      message: 'Your account and its data have been permanently deleted.',
      deleted: {
        properties: properties.deletedCount,
        inspections: inspections.deletedCount,
      },
    });
  } catch (error: any) {
    console.error('DELETE /api/auth/delete-account error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to delete account.' }, { status: 500 });
  }
}
