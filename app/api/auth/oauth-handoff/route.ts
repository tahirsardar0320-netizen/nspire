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

    const handoff = await OAuthHandoff.findOne({ sessionId });

    // A record now exists from the moment the sign-in *starts*, because that is
    // where the PKCE verifier is kept. Its mere presence therefore no longer
    // means the sign-in finished — only an email or an error does. Treating the
    // starting record as a result handed the app a sign-in with no address at
    // all ("undefined is not an object evaluating 'email.split'"), and reading
    // it destructively also threw away the verifier the exchange still needed.
    if (!handoff || (!handoff.email && !handoff.error)) {
      return NextResponse.json({ success: true, pending: true });
    }

    // Delete once there really is a result, so a sessionId that leaked into a
    // browser history or log can't be replayed to mint a second session.
    await OAuthHandoff.deleteOne({ sessionId });

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
