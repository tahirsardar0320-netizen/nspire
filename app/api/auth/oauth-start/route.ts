import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB, OAuthHandoff } from '@/lib/db';

/**
 * Opens a PKCE sign-in.
 *
 * Google has closed the implicit flow this app was using: asking for an
 * id_token directly only ever worked when Google could complete silently
 * against a session it already had, and returned "Something went wrong" as soon
 * as it actually had to show anything. The supported flow returns a short-lived
 * code that is exchanged for tokens afterwards, and PKCE is what stops an
 * intercepted code from being usable by anyone else.
 *
 * PKCE normally keeps its secret on the device that started the sign-in, but
 * here the callback lands in a *different* browser from the app's web view, so
 * the two halves share no storage. The secret is therefore generated and kept
 * here, keyed by the session id that already links the two halves, and only its
 * hash is ever sent to Google.
 */

const SESSION_ID_PATTERN = /^[a-f0-9]{48}$/;

const base64url = (buf: Buffer) => buf.toString('base64url');

export async function POST(request: NextRequest) {
  try {
    const { sessionId, provider, portal } = await request.json();

    if (typeof sessionId !== 'string' || !SESSION_ID_PATTERN.test(sessionId)) {
      return NextResponse.json({ success: false, message: 'Invalid session' }, { status: 400 });
    }

    // 64 random bytes, well inside the 43–128 character range the spec allows.
    const codeVerifier = base64url(crypto.randomBytes(64));
    const codeChallenge = base64url(crypto.createHash('sha256').update(codeVerifier).digest());

    await connectDB();
    await OAuthHandoff.findOneAndUpdate(
      { sessionId },
      {
        sessionId,
        provider: typeof provider === 'string' ? provider : 'google',
        portal: typeof portal === 'string' ? portal : '',
        codeVerifier,
        createdAt: new Date(),
      },
      { upsert: true, setDefaultsOnInsert: true }
    );

    // Only the challenge goes back to the browser. The verifier stays here.
    return NextResponse.json({ success: true, codeChallenge });
  } catch (error: any) {
    console.error('oauth-start failed:', error?.message);
    return NextResponse.json({ success: false, message: 'Could not start sign-in' }, { status: 500 });
  }
}
