import { NextRequest, NextResponse } from 'next/server';
import { issueResetCode, GENERIC_ISSUE_MESSAGE } from '@/lib/passwordReset';

// Step 1 of the reset flow reached from every sign-in page's "Forgot Password?"
// link. Issues a one-time code and emails it.

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ success: false, message: 'Email is required.' }, { status: 400 });
    }

    const result = await issueResetCode(email);

    if (!result.ok) {
      return NextResponse.json(
        { success: false, message: 'Could not send the verification code. Please try again or contact support.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: GENERIC_ISSUE_MESSAGE });
  } catch (error: any) {
    console.error('POST /api/auth/forgot-password error:', error);
    return NextResponse.json(
      { success: false, message: 'Could not send the verification code. Please try again.' },
      { status: 500 }
    );
  }
}
