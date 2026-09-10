import { NextRequest, NextResponse } from 'next/server';
import { connectDB, PasswordReset } from '@/lib/db';
import bcrypt from 'bcryptjs';

// Step 2 of the reset flow: check the emailed code before showing the
// new-password fields.

const MAX_ATTEMPTS = 5;

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ success: false, message: 'Email and code are required.' }, { status: 400 });
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

    // Cap guesses so a six-digit code can't simply be brute-forced.
    if (request.attempts >= MAX_ATTEMPTS) {
      await PasswordReset.deleteOne({ _id: request._id });
      return NextResponse.json(
        { success: false, message: 'Too many incorrect attempts. Please request a new code.' },
        { status: 429 }
      );
    }

    const matches = await bcrypt.compare(String(otp), request.otpHash);
    if (!matches) {
      request.attempts += 1;
      await request.save();
      return NextResponse.json({ success: false, message: 'Incorrect code. Please try again.' }, { status: 400 });
    }

    // Mark it usable for the reset step rather than deleting it — the password
    // itself is set in the next call.
    request.verified = true;
    await request.save();

    return NextResponse.json({ success: true, message: 'Code verified.' });
  } catch (error: any) {
    console.error('POST /api/auth/verify-otp error:', error);
    return NextResponse.json({ success: false, message: 'Could not verify the code. Please try again.' }, { status: 500 });
  }
}
