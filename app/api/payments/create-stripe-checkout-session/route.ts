import { NextRequest, NextResponse } from 'next/server';
import { connectDB, ReportUnlock } from '@/lib/db';

// Creates a $1 Stripe Checkout session for unlocking an inspection's full
// report (PDF, Excel, work order). Talks to Stripe's REST API directly —
// no SDK dependency. The secret key lives only in the STRIPE_SECRET_KEY
// environment variable on the server.
export async function POST(req: NextRequest) {
  try {
    const { inspectionId } = await req.json();
    if (!inspectionId) {
      return NextResponse.json({ success: false, message: 'inspectionId is required.' }, { status: 400 });
    }

    await connectDB();
    const existing = await ReportUnlock.findOne({ inspectionId }).lean();
    if ((existing as any)?.paid) {
      return NextResponse.json({ success: true, message: 'Already unlocked.', isReportUnlocked: true, alreadyUnlocked: true });
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { success: false, message: 'Payments are not configured yet.' },
        { status: 503 }
      );
    }

    // Send the buyer back to the summary they came from, preserving its query
    // so the report reloads with the same property/inspection context.
    const referer = req.headers.get('referer');
    const origin = req.nextUrl.origin;
    let base = `${origin}/dashboard/inspection/summary`;
    let baseParams = '';
    try {
      if (referer) {
        const r = new URL(referer);
        if (r.origin === origin && r.pathname.startsWith('/dashboard/inspection/summary')) {
          base = `${origin}${r.pathname}`;
          r.searchParams.delete('payment');
          r.searchParams.delete('session_id');
          baseParams = r.searchParams.toString();
        }
      }
    } catch { /* fall back to the plain summary URL */ }
    const join = baseParams ? `?${baseParams}&` : '?';
    const successUrl = `${base}${join}payment=success&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${base}${join}payment=cancelled`;

    const body = new URLSearchParams({
      mode: 'payment',
      'line_items[0][quantity]': '1',
      'line_items[0][price_data][currency]': 'usd',
      'line_items[0][price_data][unit_amount]': '100',
      'line_items[0][price_data][product_data][name]': 'NSPIRE Full Inspection Report',
      'line_items[0][price_data][product_data][description]': 'Unlocks PDF, Excel and work-order exports for this inspection.',
      success_url: successUrl,
      cancel_url: cancelUrl,
      'metadata[inspectionId]': String(inspectionId),
    });

    const resp = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });
    const session = await resp.json();
    if (!resp.ok) {
      console.error('Stripe session create failed:', session?.error?.message);
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

    return NextResponse.json({ success: true, message: 'Checkout session created.', checkoutUrl: session.url, sessionId: session.id });
  } catch (error: any) {
    console.error('POST /api/payments/create-stripe-checkout-session error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
