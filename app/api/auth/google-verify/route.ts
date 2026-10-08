import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

/**
 * Verifies the identity token Google returns from the OpenID implicit flow.
 *
 * The app used to ask Google for an access token and then call userinfo with
 * it. Google has closed that flow off for this kind of client — it failed
 * outright in the in-app browser and, once moved to the device browser, failed
 * again right after the password step. Asking for an id_token instead returns
 * the user's identity directly and needs no client secret, so there is nothing
 * to exchange and nothing to keep.
 *
 * The token is checked here rather than in the browser: it is only proof of who
 * the user is if its signature has been verified against Google's own keys.
 */

const GOOGLE_ISSUERS = ['https://accounts.google.com', 'accounts.google.com'];

let keyCache: { keys: any[]; fetchedAt: number } | null = null;

async function googlePublicKey(kid: string) {
  if (!keyCache || Date.now() - keyCache.fetchedAt > 60 * 60 * 1000) {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/certs');
    if (!res.ok) throw new Error('Could not fetch Google signing keys');
    const { keys } = await res.json();
    keyCache = { keys, fetchedAt: Date.now() };
  }
  const jwk = keyCache.keys.find((k: any) => k.kid === kid);
  if (!jwk) throw new Error('Google signing key not found for this token');
  return crypto.createPublicKey({ key: jwk, format: 'jwk' });
}

export async function POST(request: NextRequest) {
  try {
    const { idToken, nonce } = await request.json();
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!idToken || !clientId) {
      return NextResponse.json({ success: false, message: 'Missing sign-in data' }, { status: 400 });
    }

    const [headerB64] = String(idToken).split('.');
    const header = JSON.parse(Buffer.from(headerB64, 'base64url').toString('utf8'));
    const publicKey = await googlePublicKey(header.kid);

    const claims = jwt.verify(idToken, publicKey, {
      algorithms: ['RS256'],
      issuer: GOOGLE_ISSUERS as unknown as string,
      audience: clientId,
    }) as { email?: string; name?: string; nonce?: string; email_verified?: boolean };

    // The nonce ties this token to the sign-in this device actually started.
    if (nonce && claims.nonce !== nonce) {
      return NextResponse.json({ success: false, message: 'Sign-in could not be verified' }, { status: 401 });
    }

    if (!claims.email) {
      return NextResponse.json({ success: false, message: 'Google did not share an email address' }, { status: 400 });
    }

    return NextResponse.json({ success: true, email: claims.email, fullName: claims.name || '' });
  } catch (error: any) {
    console.error('Google id_token verification failed:', error?.message);
    return NextResponse.json({ success: false, message: 'Sign-in could not be verified' }, { status: 401 });
  }
}
