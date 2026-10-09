/**
 * Verifies an identity token issued by Google.
 *
 * A token is only proof of who someone is once its signature has been checked
 * against Google's published keys, so this never runs in the browser. Shared by
 * the code-exchange route and the older id_token route so there is one place
 * that decides whether a token is trustworthy.
 */

import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { fetchWithTimeout } from './httpFetch';

const GOOGLE_ISSUERS = ['https://accounts.google.com', 'accounts.google.com'];

let keyCache: { keys: any[]; fetchedAt: number } | null = null;

async function googlePublicKey(kid: string) {
  if (!keyCache || Date.now() - keyCache.fetchedAt > 60 * 60 * 1000) {
    // A stalled key fetch would hang the sign-in request itself, so it is
    // capped well below the client's own timeout.
    const res = await fetchWithTimeout('https://www.googleapis.com/oauth2/v3/certs', {}, 10000);
    if (!res.ok) throw new Error('Could not fetch Google signing keys');
    const { keys } = await res.json();
    keyCache = { keys, fetchedAt: Date.now() };
  }
  const jwk = keyCache.keys.find((k: any) => k.kid === kid);
  if (!jwk) throw new Error('Google signing key not found for this token');
  return crypto.createPublicKey({ key: jwk, format: 'jwk' });
}

export interface GoogleClaims {
  email?: string;
  name?: string;
  nonce?: string;
  email_verified?: boolean;
}

export async function verifyGoogleIdToken(idToken: string, expectedNonce?: string): Promise<GoogleClaims> {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!idToken || !clientId) throw new Error('Missing sign-in data');

  const [headerB64] = String(idToken).split('.');
  const header = JSON.parse(Buffer.from(headerB64, 'base64url').toString('utf8'));
  const publicKey = await googlePublicKey(header.kid);

  const claims = jwt.verify(idToken, publicKey, {
    algorithms: ['RS256'],
    issuer: GOOGLE_ISSUERS as unknown as string,
    audience: clientId,
  }) as GoogleClaims;

  // Ties the token to the sign-in this device actually started.
  if (expectedNonce && claims.nonce !== expectedNonce) {
    throw new Error('Sign-in could not be verified');
  }
  if (!claims.email) throw new Error('Google did not share an email address');

  return claims;
}
