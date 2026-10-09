import { NextRequest, NextResponse } from 'next/server';
import { connectDB, OAuthHandoff } from '@/lib/db';
import { verifyGoogleIdToken } from '@/lib/googleIdToken';
import { fetchWithTimeout } from '@/lib/httpFetch';

/**
 * Exchanges the code Google hands back for the user's identity.
 *
 * Runs on the server because it needs two things the browser must never hold:
 * the client secret, and the PKCE verifier stored when the sign-in started.
 */

const SESSION_ID_PATTERN = /^[a-f0-9]{48}$/;

/**
 * Google rejects a redirect_uri that differs by even a trailing slash, so the
 * exchange has to repeat exactly the one used to start the flow. It is still
 * checked against the registered set rather than trusted, so a caller cannot
 * point the exchange somewhere of its own choosing.
 */
const ALLOWED_REDIRECT_URIS = [
  'https://nspireinspectionapp.com/oauth-callback',
  'https://www.nspireinspectionapp.com/oauth-callback',
  'http://localhost:3000/oauth-callback',
  'http://localhost:3100/oauth-callback',
];

export async function POST(request: NextRequest) {
  try {
    const { sessionId, code, redirectUri } = await request.json();

    if (typeof sessionId !== 'string' || !SESSION_ID_PATTERN.test(sessionId)) {
      return NextResponse.json({ success: false, message: 'Invalid session' }, { status: 400 });
    }
    if (typeof code !== 'string' || !code) {
      return NextResponse.json({ success: false, message: 'Missing sign-in code' }, { status: 400 });
    }
    if (typeof redirectUri !== 'string' || !ALLOWED_REDIRECT_URIS.includes(redirectUri)) {
      return NextResponse.json({ success: false, message: 'Unrecognised redirect' }, { status: 400 });
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      console.error('google-exchange: GOOGLE_CLIENT_SECRET is not configured');
      return NextResponse.json({ success: false, message: 'Sign-in is not configured' }, { status: 500 });
    }

    await connectDB();
    const handoff = await OAuthHandoff.findOne({ sessionId });
    const codeVerifier = handoff?.codeVerifier;
    if (!codeVerifier) {
      // Either this sign-in was never started here, or it sat long enough for
      // the record to expire. Both mean the same thing to the user.
      return NextResponse.json(
        { success: false, message: 'This sign-in took too long. Please try again.' },
        { status: 400 }
      );
    }

    const tokenRes = await fetchWithTimeout(
      'https://oauth2.googleapis.com/token',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
          code_verifier: codeVerifier,
        }).toString(),
      },
      15000
    );

    const tokens = await tokenRes.json().catch(() => null);
    if (!tokenRes.ok || !tokens?.id_token) {
      // Google's own wording here is not useful to an inspector, and the detail
      // belongs in the logs rather than on screen.
      console.error('google-exchange rejected by Google:', tokens?.error, tokens?.error_description);
      return NextResponse.json({ success: false, message: 'Google could not complete the sign-in' }, { status: 401 });
    }

    const claims = await verifyGoogleIdToken(tokens.id_token);

    // The verifier is single-use; drop it so the same code cannot be replayed.
    await OAuthHandoff.updateOne({ sessionId }, { $unset: { codeVerifier: '' } });

    const email = claims.email || '';
    return NextResponse.json({
      success: true,
      email,
      fullName: claims.name || (email.includes('@') ? email.split('@')[0] : email),
    });
  } catch (error: any) {
    console.error('google-exchange failed:', error?.message);
    return NextResponse.json({ success: false, message: 'Sign-in could not be verified' }, { status: 401 });
  }
}
