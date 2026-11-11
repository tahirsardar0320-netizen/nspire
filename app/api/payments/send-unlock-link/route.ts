import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dns from 'node:dns/promises';
import { connectDB, ReportUnlock } from '@/lib/db';
import { fetchWithTimeout } from '@/lib/httpFetch';

const JWT_SECRET = process.env.JWT_SECRET || 'inspire_jwt_secret_key_2024';

// Emails a $1 Stripe payment link for an inspection's full report. The payer
// opens the link on their own device; Stripe sends them to /api/payments/confirm
// on success, which unlocks the report here — no login needed on their side.
export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization') || '';
    try {
      jwt.verify(auth.replace('Bearer ', ''), JWT_SECRET);
    } catch {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { inspectionId, email, propertyName } = await req.json();
    if (!inspectionId || !email) {
      return NextResponse.json({ success: false, message: 'inspectionId and email are required.' }, { status: 400 });
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ success: false, message: 'Payments are not configured yet.' }, { status: 503 });
    }

    await connectDB();
    const existing = await ReportUnlock.findOne({ inspectionId }).lean();
    if ((existing as any)?.paid) {
      return NextResponse.json({ success: true, message: 'Report is already unlocked.', alreadyUnlocked: true });
    }

    const origin = req.nextUrl.origin;
    const body = new URLSearchParams({
      mode: 'payment',
      customer_email: String(email),
      'line_items[0][quantity]': '1',
      'line_items[0][price_data][currency]': 'usd',
      'line_items[0][price_data][unit_amount]': '100',
      'line_items[0][price_data][product_data][name]': 'NSPIRE Full Inspection Report',
      'line_items[0][price_data][product_data][description]': 'Unlocks PDF, Excel and work-order exports for this inspection.',
      success_url: `${origin}/api/payments/confirm?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/api/payments/confirm?cancelled=1`,
      'metadata[inspectionId]': String(inspectionId),
    });
    const resp = await fetchWithTimeout('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${secretKey}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
    const session = await resp.json();
    if (!resp.ok) {
      return NextResponse.json(
        { success: false, message: session?.error?.message || 'Stripe rejected the checkout request.' },
        { status: 502 }
      );
    }

    await ReportUnlock.findOneAndUpdate(
      { inspectionId },
      { $set: { stripeSessionId: session.id, amountCents: 100 }, $setOnInsert: { paid: false } },
      { upsert: true }
    );

    const subject = 'NSPIRE Full Inspection Report — Payment Link ($1)';
    const text = `Hello,\n\nA full NSPIRE inspection report${propertyName ? ` for ${propertyName}` : ''} is ready to unlock.\n\nPay $1 securely with Stripe using this link:\n${session.url}\n\nOnce the payment completes, the report unlocks automatically.\n\n— NSPIRE Inspection`;
    const html = `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;border:1px solid #e2e8f0;border-radius:12px">
      <h2 style="color:#005E92;margin:0 0 12px">Unlock the Full Inspection Report</h2>
      <p style="color:#334155">A full NSPIRE inspection report${propertyName ? ` for <b>${String(propertyName).replace(/[<>&]/g, '')}</b>` : ''} is ready. Pay <b>$1</b> securely with Stripe:</p>
      <p style="text-align:center;margin:24px 0">
        <a href="${session.url}" style="background:#005E92;color:#fff;font-weight:bold;padding:14px 28px;border-radius:10px;text-decoration:none">Pay $1 &amp; Unlock Report</a>
      </p>
      <p style="color:#64748b;font-size:12px">Once the payment completes, the report unlocks automatically. If the button does not work, open this link:<br>${session.url}</p>
    </div>`;

    // Brevo over HTTPS first; direct Gmail SMTP as the fallback.
    const sender = process.env.EMAIL_USER?.trim().toLowerCase();
    let sent = false;
    if (process.env.BREVO_API_KEY && sender) {
      const r = await fetchWithTimeout('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'api-key': process.env.BREVO_API_KEY, 'Content-Type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({
          sender: { email: sender, name: 'NSPIRE Inspection' },
          to: [{ email }],
          subject,
          textContent: text,
          htmlContent: html,
        }),
      });
      if (r.ok) sent = true;
      else console.error('Brevo rejected unlock-link email:', r.status, (await r.text()).slice(0, 200));
    }
    if (!sent) {
      const user = process.env.EMAIL_USER;
      const pass = process.env.EMAIL_APP_PASSWORD;
      if (!user || !pass) {
        return NextResponse.json({ success: false, message: 'Email sending is not configured on the server.' }, { status: 503 });
      }
      let host = 'smtp.gmail.com';
      try { const [ipv4] = await dns.resolve4('smtp.gmail.com'); if (ipv4) host = ipv4; } catch {}
      const transporter = nodemailer.createTransport({
        host, port: 587, secure: false,
        auth: { user, pass },
        tls: { servername: 'smtp.gmail.com' },
        connectionTimeout: 15000, greetingTimeout: 15000, socketTimeout: 15000,
      });
      await transporter.sendMail({ from: `"NSPIRE Inspection" <${user}>`, to: email, subject, text, html });
    }

    return NextResponse.json({ success: true, message: `Payment link sent to ${email}.` });
  } catch (error: any) {
    console.error('POST /api/payments/send-unlock-link error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to send the payment link.' }, { status: 500 });
  }
}
