import { NextRequest, NextResponse } from 'next/server';
import { connectDB, ReportUnlock } from '@/lib/db';

// Called when the buyer lands back on the summary with ?session_id=...
// Verifies the payment with Stripe itself (never trusts the redirect alone)
// and flips the unlock flag on success.
export async function GET(_req: NextRequest, { params }: { params: { sessionId: string } }) {
  try {
    const sessionId = params.sessionId;
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ success: false, message: 'Payments are not configured yet.' }, { status: 503 });
    }

    const resp = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
      headers: { Authorization: `Bearer ${secretKey}` },
    });
    const session = await resp.json();
    if (!resp.ok) {
      return NextResponse.json(
        { success: false, message: session?.error?.message || 'Unable to look up the Stripe session.' },
        { status: 502 }
      );
    }

    const paid = session.payment_status === 'paid';
    const inspectionId = session.metadata?.inspectionId;

    if (paid && inspectionId) {
      await connectDB();
      await ReportUnlock.findOneAndUpdate(
        { inspectionId },
        { $set: { paid: true, stripeSessionId: sessionId, unlockedAt: new Date() } },
        { upsert: true }
      );
    }

    return NextResponse.json({
      success: true,
      paymentStatus: session.payment_status,
      isReportUnlocked: paid,
      sessionId,
    });
  } catch (error: any) {
    console.error('GET /api/payments/stripe-session-status error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
