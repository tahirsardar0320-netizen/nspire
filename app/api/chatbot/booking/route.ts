import { NextRequest, NextResponse } from 'next/server';
import { escapeHTML, getTransporter } from '@/lib/mailer';
import { clientKey, rateLimit } from '@/lib/chatbot/rateLimit';

export const runtime = 'nodejs';

const RECIPIENT = process.env.CHATBOT_NOTIFY_EMAIL || 'info@nspireinspectionapp.com';

type BookingPayload = {
  time: string;
  firstDate: string;
  secondDate: string;
  state: string;
  country: string;
  city: string;
  email: string;
  phone: string;
  notes?: string;
};

const FIELD_LABELS: Record<keyof BookingPayload, string> = {
  time: 'Preferred time',
  firstDate: 'First preferred date',
  secondDate: 'Second preferred date',
  state: 'State',
  country: 'Country',
  city: 'City',
  email: 'Email address',
  phone: 'Phone number',
  notes: 'Chat context',
};

const REQUIRED: (keyof BookingPayload)[] = [
  'time', 'firstDate', 'secondDate', 'state', 'country', 'city', 'email', 'phone',
];

function buildEmailHTML(booking: BookingPayload) {
  const rows = (Object.keys(FIELD_LABELS) as (keyof BookingPayload)[])
    .filter((key) => booking[key])
    .map(
      (key) => `<tr>
        <td style="padding:8px 0;font-size:15px;color:#111827;font-weight:bold;width:190px;vertical-align:top;">${FIELD_LABELS[key]}</td>
        <td style="padding:8px 0;font-size:15px;color:#374151;white-space:pre-wrap;">${escapeHTML(booking[key])}</td>
      </tr>`
    )
    .join('');

  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px 0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;">
      <tr><td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:#ffffff;">
          <tr><td style="background:#006795;padding:28px 24px;text-align:center;">
            <h1 style="margin:0;font-size:22px;color:#ffffff;font-weight:bold;">New Inspection Request</h1>
            <p style="margin:6px 0 0;font-size:13px;color:#cfe6f1;">Submitted from the NSPIRE Intelligence chatbot</p>
          </td></tr>
          <tr><td style="padding:28px 40px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
          </td></tr>
          <tr><td style="background:#f9fafb;padding:16px 24px;text-align:center;border-top:1px solid #e5e7eb;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">The requester was told the team will reach out within 24-48 hours.</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

// POST /api/chatbot/booking — deliver a chatbot inspection request to the team inbox
export async function POST(req: NextRequest) {
  if (!rateLimit(clientKey(req), 5, 60_000)) {
    return NextResponse.json(
      { success: false, message: 'Too many requests. Please wait a moment and try again.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const booking = {} as BookingPayload;

    for (const key of Object.keys(FIELD_LABELS) as (keyof BookingPayload)[]) {
      booking[key] = String(body?.[key] ?? '').trim().slice(0, 600);
    }

    const missing = REQUIRED.filter((key) => !booking[key]);
    if (missing.length) {
      return NextResponse.json(
        {
          success: false,
          message: `Please complete: ${missing.map((key) => FIELD_LABELS[key]).join(', ')}.`,
        },
        { status: 400 }
      );
    }
    if (!/^\S+@\S+\.\S+$/.test(booking.email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }
    if (booking.phone.replace(/\D/g, '').length < 7) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid phone number.' },
        { status: 400 }
      );
    }

    const subject = `Inspection Request — ${booking.city}, ${booking.state} (${booking.firstDate})`;
    const textBody = (Object.keys(FIELD_LABELS) as (keyof BookingPayload)[])
      .filter((key) => booking[key])
      .map((key) => `${FIELD_LABELS[key]}: ${booking[key]}`)
      .join('\n');
    const htmlBody = buildEmailHTML(booking);

    if (process.env.BREVO_API_KEY) {
      const sender = process.env.EMAIL_USER?.trim().toLowerCase();
      if (!sender) {
        return NextResponse.json(
          { success: false, message: 'Email sending is not configured on the server yet.' },
          { status: 503 }
        );
      }

      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify({
          sender: { email: sender, name: 'NSPIRE Intelligence' },
          to: [{ email: RECIPIENT }],
          replyTo: { email: booking.email },
          subject,
          textContent: textBody,
          htmlContent: htmlBody,
        }),
      });

      if (!res.ok) {
        const detail = await res.text();
        throw new Error(`Email provider rejected the request (${res.status}): ${detail.slice(0, 300)}`);
      }

      return NextResponse.json({ success: true });
    }

    const transporter = await getTransporter();
    if (!transporter) {
      return NextResponse.json(
        { success: false, message: 'Email sending is not configured on the server yet.' },
        { status: 503 }
      );
    }

    await transporter.sendMail({
      from: `"NSPIRE Intelligence" <${process.env.EMAIL_USER}>`,
      to: RECIPIENT,
      replyTo: booking.email,
      subject,
      text: textBody,
      html: htmlBody,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('POST /api/chatbot/booking error:', error);
    return NextResponse.json(
      { success: false, message: 'Could not submit your request. Please try again.' },
      { status: 500 }
    );
  }
}
