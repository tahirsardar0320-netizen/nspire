import { NextRequest, NextResponse } from 'next/server';
import { issueResetCode, GENERIC_ISSUE_MESSAGE } from '@/lib/passwordReset';

// The "Resend code" button on the reset screen. Same work as the initial
// request — a new code replaces the previous one.

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ success: false, message: 'Email is required.' }, { status: 400 });
    }

    const result = await issueResetCode(email);

    if (!result.ok) {
      return NextResponse.json(
        { success: false, message: 'Could not resend the verification code. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: GENERIC_ISSUE_MESSAGE });
  } catch (error: any) {
    console.error('POST /api/auth/resend-reset-otp error:', error);
    return NextResponse.json(
      { success: false, message: 'Could not resend the verification code. Please try again.' },
      { status: 500 }
    );
  }
}
