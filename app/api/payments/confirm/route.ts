import { NextRequest, NextResponse } from 'next/server';
import { connectDB, ReportUnlock } from '@/lib/db';

const page = (title: string, body: string, color: string) => `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
<body style="font-family:Arial,sans-serif;background:#E8F4F8;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0">
  <div style="background:#fff;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,.08);padding:40px;max-width:420px;text-align:center">
    <div style="font-size:44px">${color === 'green' ? '✅' : 'ℹ️'}</div>
    <h2 style="color:${color === 'green' ? '#047857' : '#005E92'};margin:12px 0 8px">${title}</h2>
    <p style="color:#475569;font-size:14px">${body}</p>
  </div>
</body></html>`;

// Stripe sends the payer here after checkout. Verifies the session with
// Stripe itself and flips the unlock — the payer needs no account or login.
export async function GET(req: NextRequest) {
  try {
    if (req.nextUrl.searchParams.get('cancelled')) {
      return new NextResponse(page('Payment cancelled', 'No charge was made. You can close this page.', 'blue'), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    const sessionId = req.nextUrl.searchParams.get('session_id');
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!sessionId || !secretKey) {
      return new NextResponse(page('Something is missing', 'This payment link is incomplete. Please use the link from your email again.', 'blue'), {
        status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    const resp = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
      headers: { Authorization: `Bearer ${secretKey}` },
    });
    const session = await resp.json();
    const paid = resp.ok && session.payment_status === 'paid';
    const inspectionId = session?.metadata?.inspectionId;

    if (paid && inspectionId) {
      await connectDB();
      await ReportUnlock.findOneAndUpdate(
        { inspectionId },
        { $set: { paid: true, stripeSessionId: sessionId, unlockedAt: new Date() } },
        { upsert: true }
      );
      return new NextResponse(page('Payment received — report unlocked!', 'The full inspection report is now unlocked in the NSPIRE app. You can close this page.', 'green'), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    return new NextResponse(page('Payment not completed yet', 'The payment has not gone through. Please try the link from your email again.', 'blue'), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch (error: any) {
    console.error('GET /api/payments/confirm error:', error);
    return new NextResponse(page('Something went wrong', 'Please try the payment link again in a moment.', 'blue'), {
      status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
}
