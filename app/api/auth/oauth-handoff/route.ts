import { NextRequest, NextResponse } from 'next/server';
import { connectDB, OAuthHandoff } from '@/lib/db';

// Bridges an OAuth sign-in that finished in a different browser than the one
// that started it. In the mobile app Capacitor opens accounts.google.com in the
// system browser, so the callback page can't postMessage back to the WebView —
// it POSTs here instead, and the app picks the result up with GET.
//
// The sessionId is the only thing linking the two halves, so it's treated like
// a one-time code: 48 hex chars of CSPRNG entropy, deleted on read, and expired
// by a TTL index after 5 minutes.

const SESSION_ID_PATTERN = /^[a-f0-9]{48}$/;

export async function POST(request: NextRequest) {
  try {
    const { sessionId, provider, portal, email, fullName, error } = await request.json();

    if (typeof sessionId !== 'string' || !SESSION_ID_PATTERN.test(sessionId)) {
      return NextResponse.json({ success: false, message: 'Invalid session' }, { status: 400 });
    }

    await connectDB();

    await OAuthHandoff.findOneAndUpdate(
      { sessionId },
      {
        sessionId,
        provider: typeof provider === 'string' ? provider : undefined,
        portal: typeof portal === 'string' ? portal : undefined,
        email: typeof email === 'string' ? email : undefined,
        fullName: typeof fullName === 'string' ? fullName : undefined,
        error: typeof error === 'string' ? error : undefined,
        createdAt: new Date(),
      },
      { upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('OAuth handoff store error:', err);
    return NextResponse.json({ success: false, message: 'Failed to store result' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('sessionId') || '';

    if (!SESSION_ID_PATTERN.test(sessionId)) {
      return NextResponse.json({ success: false, message: 'Invalid session' }, { status: 400 });
    }

    await connectDB();

    // Delete on read so a sessionId that leaked into a browser history or log
    // can't be replayed to mint a second session.
    const handoff = await OAuthHandoff.findOneAndDelete({ sessionId });

    if (!handoff) {
      return NextResponse.json({ success: true, pending: true });
    }

    return NextResponse.json({
      success: true,
      pending: false,
      result: {
        provider: handoff.provider,
        portal: handoff.portal,
        email: handoff.email,
        fullName: handoff.fullName,
        error: handoff.error,
      },
    });
  } catch (err) {
    console.error('OAuth handoff read error:', err);
    return NextResponse.json({ success: false, message: 'Failed to read result' }, { status: 500 });
  }
}
