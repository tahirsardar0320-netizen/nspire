import nodemailer from 'nodemailer';
import dns from 'node:dns/promises';

const SMTP_HOSTNAME = 'smtp.gmail.com';

/**
 * Shared SMTP transport. Returns null when credentials aren't configured so
 * callers can degrade rather than throw.
 */
export async function getTransporter() {
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

export const escapeHTML = (value: unknown) =>
  String(value ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string)
  );

export function buildOtpEmailHTML(otp: string) {
  const code = escapeHTML(otp);
  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px 0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;">
      <tr><td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:#ffffff;">
          <tr><td style="background:#006795;padding:28px 24px;text-align:center;">
            <h1 style="margin:0;font-size:22px;color:#ffffff;font-weight:bold;">Reset Your Password</h1>
          </td></tr>
          <tr><td style="padding:32px 24px;text-align:center;">
            <p style="margin:0 0 20px;font-size:15px;color:#374151;">
              Use this verification code to reset your NSPIRE password:
            </p>
            <p style="margin:0 0 20px;font-size:34px;letter-spacing:10px;font-weight:bold;color:#006795;font-family:'Courier New',monospace;">
              ${code}
            </p>
            <p style="margin:0 0 8px;font-size:14px;color:#6b7280;">This code expires in 15 minutes.</p>
            <p style="margin:0;font-size:13px;color:#9ca3af;">
              If you didn't ask to reset your password, you can ignore this email — nothing has changed.
            </p>
          </td></tr>
          <tr><td style="background:#f9fafb;padding:16px 24px;text-align:center;border-top:1px solid #e5e7eb;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">NSPIRE Inspection App</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}
