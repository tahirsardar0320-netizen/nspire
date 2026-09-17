import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { connectDB, OAuthHandoff } from '@/lib/db';
import { decodeState } from '@/lib/social-auth';

// Apple's Sign In flow uses response_mode=form_post — unlike Google/Facebook,
// which stay entirely client-side, Apple POSTs the result straight to this
// redirect_uri from the user's browser. This route verifies the id_token,
// then parks {email, fullName} the same way /api/auth/oauth-handoff does, so
// the page that started the sign-in (polling via waitForOAuth) picks it up
// exactly like a Google/Facebook result — nothing else about that flow changes.

const SESSION_ID_PATTERN = /^[a-f0-9]{48}$/;

let applePublicKeysCache: { keys: any[]; fetchedAt: number } | null = null;

async function getApplePublicKey(kid: string) {
  if (!applePublicKeysCache || Date.now() - applePublicKeysCache.fetchedAt > 60 * 60 * 1000) {
    const res = await fetch('https://appleid.apple.com/auth/keys');
    if (!res.ok) throw new Error('Failed to fetch Apple signing keys');
    const { keys } = await res.json();
    applePublicKeysCache = { keys, fetchedAt: Date.now() };
  }
  const jwk = applePublicKeysCache.keys.find((k: any) => k.kid === kid);
  if (!jwk) throw new Error('Apple signing key not found for this token');
  return crypto.createPublicKey({ key: jwk, format: 'jwk' });
}

function verifyAppleIdToken(idToken: string, clientId: string) {
  const [headerB64] = idToken.split('.');
  const header = JSON.parse(Buffer.from(headerB64, 'base64url').toString('utf8'));
  return getApplePublicKey(header.kid).then((publicKey) =>
    jwt.verify(idToken, publicKey, {
      algorithms: ['RS256'],
      issuer: 'https://appleid.apple.com',
      audience: clientId,
    }) as { sub: string; email?: string; email_verified?: boolean | string }
  );
}

function htmlResponse(body: string) {
  return new NextResponse(
    `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Signing in…</title>
    <style>body{font-family:system-ui,sans-serif;background:#E8F4F8;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;text-align:center;color:#1f2937}
    .card{max-width:340px;padding:24px}.icon{height:56px;width:56px;border-radius:9999px;color:#fff;font-size:28px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px}
    </style></head><body>${body}</body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}

const SUCCESS_HTML = `<div class="card"><div class="icon" style="background:#006795">✓</div><p style="font-weight:600;font-size:18px">You're signed in</p><p style="color:#6b7280;font-size:14px;margin-top:8px">Return to the NSPIRE app to continue. You can close this tab.</p></div>`;

async function parkHandoffResult(sessionId: string, payload: Record<string, unknown>) {
  await connectDB();
  await OAuthHandoff.findOneAndUpdate(
    { sessionId },
    { sessionId, createdAt: new Date(), ...payload },
    { upsert: true, setDefaultsOnInsert: true }
  );
}

export async function POST(request: NextRequest) {
  const clientId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID;
  let sessionId = '';

  try {
    const form = await request.formData();
    const idToken = form.get('id_token') as string | null;
    const stateRaw = form.get('state') as string | null;
    const userRaw = form.get('user') as string | null; // only present on the user's first authorization
    const appleError = form.get('error') as string | null;

    const state = stateRaw ? decodeState(stateRaw) : null;
    sessionId = state?.sessionId || '';

    if (!SESSION_ID_PATTERN.test(sessionId)) {
      return htmlResponse(`<div class="card"><p>Missing session — please try signing in again from the app.</p></div>`);
    }

    if (appleError) {
      await parkHandoffResult(sessionId, { provider: 'apple', error: `Apple sign-in failed: ${appleError}` });
      return htmlResponse(SUCCESS_HTML);
    }

    if (!idToken || !clientId) {
      await parkHandoffResult(sessionId, { provider: 'apple', error: 'Apple did not return the expected sign-in data.' });
      return htmlResponse(SUCCESS_HTML);
    }

    const claims = await verifyAppleIdToken(idToken, clientId);
    const email = claims.email;
    if (!email) {
      await parkHandoffResult(sessionId, { provider: 'apple', error: 'Apple did not share an email address for this account.' });
      return htmlResponse(SUCCESS_HTML);
    }

    let fullName = '';
    if (userRaw) {
      try {
        const parsed = JSON.parse(userRaw);
        fullName = [parsed?.name?.firstName, parsed?.name?.lastName].filter(Boolean).join(' ');
      } catch {
        // Malformed — fall back to the email-derived name downstream.
      }
    }

    await parkHandoffResult(sessionId, {
      provider: 'apple',
      portal: state?.portal,
      email,
      fullName,
    });

    return htmlResponse(SUCCESS_HTML);
  } catch (error: any) {
    console.error('Apple OAuth callback error:', error);
    if (sessionId) {
      await parkHandoffResult(sessionId, { provider: 'apple', error: 'Failed to complete Apple sign-in.' }).catch(() => {});
    }
    return htmlResponse(`<div class="card"><div class="icon" style="background:#ef4444">!</div><p style="font-weight:600;font-size:18px">Sign-in failed</p><p style="color:#6b7280;font-size:14px;margin-top:8px">Please return to the app and try again.</p></div>`);
  }
}
