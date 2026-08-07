import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import dns from 'node:dns/promises';

const SMTP_HOSTNAME = 'smtp.gmail.com';
const CONTACT_RECIPIENT = 'support@inspire.com';

async function getTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_APP_PASSWORD;
  if (!user || !pass) return null;

  let host = SMTP_HOSTNAME;
  try {
    const [ipv4] = await dns.resolve4(SMTP_HOSTNAME);
    if (ipv4) host = ipv4;
  } catch {
    // Fall back to the hostname — a random-address retry beats not trying at all.
  }

  return nodemailer.createTransport({
    host,
    port: 587,
    secure: false,
    auth: { user, pass },
    tls: { servername: SMTP_HOSTNAME },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 15000,
  });
}

const escapeHTML = (value: unknown) =>
  String(value ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string)
  );

function buildContactEmailHTML({ name, email, subject, message }: { name: string; email: string; subject?: string; message: string }) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px 0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:#ffffff;">
            <tr>
              <td style="background:#006795;padding:28px 24px;text-align:center;">
                <h1 style="margin:0;font-size:24px;color:#ffffff;font-weight:bold;">New Contact Form Message</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 40px;">
                <p style="margin:0 0 6px;font-size:15px;color:#374151;"><strong style="color:#111827;">Name:</strong> ${escapeHTML(name)}</p>
                <p style="margin:0 0 6px;font-size:15px;color:#374151;"><strong style="color:#111827;">Email:</strong> ${escapeHTML(email)}</p>
                ${subject ? `<p style="margin:0 0 6px;font-size:15px;color:#374151;"><strong style="color:#111827;">Subject:</strong> ${escapeHTML(subject)}</p>` : ''}
                <p style="margin:18px 0 6px;font-size:15px;color:#111827;font-weight:bold;">Message:</p>
                <p style="margin:0;font-size:15px;line-height:1.6;color:#374151;white-space:pre-wrap;">${escapeHTML(message)}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

// POST /api/contact/send — deliver a contact-form submission to the support inbox
export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !message) {
      return NextResponse.json({ success: false, message: 'Name and message are required.' }, { status: 400 });
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ success: false, message: 'A valid email address is required.' }, { status: 400 });
    }

    const emailSubject = `Contact Form: ${subject || 'New message'} — ${name}`;
    const textBody = `Name: ${name}\nEmail: ${email}${subject ? `\nSubject: ${subject}` : ''}\n\n${message}`;
    const htmlBody = buildContactEmailHTML({ name, email, subject, message });

    if (process.env.BREVO_API_KEY) {
      const sender = process.env.EMAIL_USER?.trim().toLowerCase();
      if (!sender) {
        return NextResponse.json(
          { success: false, message: 'EMAIL_USER must be set to the verified Brevo sender address.' },
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
          sender: { email: sender, name: 'NSPIRE Inspection' },
          to: [{ email: CONTACT_RECIPIENT }],
          replyTo: { email, name },
          subject: emailSubject,
          textContent: textBody,
          htmlContent: htmlBody,
        }),
      });

      if (!res.ok) {
        const detail = await res.text();
        throw new Error(`Email provider rejected the request (${res.status}): ${detail.slice(0, 300)}`);
      }

      return NextResponse.json({ success: true, message: 'Message sent successfully.' });
    }

    const transporter = await getTransporter();
    if (!transporter) {
      return NextResponse.json(
        { success: false, message: 'Email sending is not configured on the server yet.' },
        { status: 503 }
      );
    }

    await transporter.sendMail({
      from: `"NSPIRE Inspection" <${process.env.EMAIL_USER}>`,
      to: CONTACT_RECIPIENT,
      replyTo: email,
      subject: emailSubject,
      text: textBody,
      html: htmlBody,
    });

    return NextResponse.json({ success: true, message: 'Message sent successfully.' });
  } catch (error: any) {
    console.error('POST /api/contact/send error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to send message.' }, { status: 500 });
  }
}
