import { NextRequest, NextResponse } from 'next/server';
import { connectDB, User, PasswordReset } from '@/lib/db';
import bcrypt from 'bcryptjs';

// Step 3 of the reset flow: set the new password, once the emailed code has
// been verified.

export async function POST(req: NextRequest) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Email, code and new password are required.' },
        { status: 400 }
      );
    }

    if (String(newPassword).length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters.' },
        { status: 400 }
      );
    }

    await connectDB();

    const normalised = String(email).toLowerCase().trim();
    const request = await PasswordReset.findOne({ email: normalised });

    if (!request) {
      return NextResponse.json(
        { success: false, message: 'That code has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Re-check the code here too. Trusting the earlier verify call alone would
    // let this endpoint be called directly with any code.
    const matches = await bcrypt.compare(String(otp), request.otpHash);
    if (!matches || !request.verified) {
      return NextResponse.json({ success: false, message: 'Invalid or unverified code.' }, { status: 400 });
    }

    const user = await User.findOne({ email: normalised });
    if (!user) {
      return NextResponse.json({ success: false, message: 'Account not found.' }, { status: 404 });
    }

    user.password = await bcrypt.hash(String(newPassword), 12);
    await user.save();

    // Burn the code so it can't set a second password.
    await PasswordReset.deleteMany({ email: normalised });

    console.log('🔑 Password reset completed for:', normalised);

    return NextResponse.json({ success: true, message: 'Your password has been reset. You can now log in.' });
  } catch (error: any) {
    console.error('POST /api/auth/reset-password error:', error);
    return NextResponse.json({ success: false, message: 'Could not reset the password. Please try again.' }, { status: 500 });
  }
}
