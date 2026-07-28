import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import dns from 'node:dns/promises';

const MAX_PDF_BYTES = 15 * 1024 * 1024; // 15MB

const SMTP_HOSTNAME = 'smtp.gmail.com';

async function getTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_APP_PASSWORD;
  if (!user || !pass) return null;

  // nodemailer resolves the SMTP host to both its A and AAAA records and then picks one
  // at RANDOM. Railway's containers advertise an IPv6 interface but have no IPv6 route,
  // so every send that happened to draw the AAAA address died with ENETUNREACH. Resolve
  // the IPv4 address here and hand nodemailer a literal IP so it never gets the choice.
  let host = SMTP_HOSTNAME;
  try {
    const [ipv4] = await dns.resolve4(SMTP_HOSTNAME);
    if (ipv4) host = ipv4;
  } catch {
    // Fall back to the hostname — a random-address retry beats not trying at all.
  }

  return nodemailer.createTransport({
    // The 'gmail' service preset connects on port 465 (implicit TLS), which Railway's
    // network was blocking outright — connections hung until nodemailer's ETIMEDOUT.
    // Port 587 (STARTTLS) is the port cloud hosts typically leave open for outbound SMTP.
    host,
    port: 587,
    secure: false,
    auth: { user, pass },
    // Certificate is issued to the hostname, not the IP we just dialed.
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

function buildReportEmailHTML({
  propertyName,
  propertyAddress,
  inspectionNo,
  reportUrl,
}: {
  propertyName?: string;
  propertyAddress?: string;
  inspectionNo?: string;
  reportUrl?: string;
}) {
  const detailRow = (label: string, value?: string) =>
    value
      ? `<p style="margin:0 0 6px;font-size:15px;color:#374151;"><strong style="color:#111827;">${escapeHTML(label)}:</strong> ${escapeHTML(value)}</p>`
      : '';

  // Inlined styles and table layout only — email clients strip <style> blocks and
  // do not support flex/grid.
  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px 0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:#ffffff;">
            <tr>
              <td style="background:#006795;padding:28px 24px;text-align:center;">
                <h1 style="margin:0;font-size:24px;color:#ffffff;font-weight:bold;">Inspection Report Ready</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 40px;">
                <p style="margin:0 0 18px;font-size:16px;color:#374151;">Hello,</p>
                <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#374151;">
                  Your comprehensive inspection report has been successfully generated and is now ready for review.
                  The full PDF is attached to this email.
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;">
                  <tr>
                    <td style="padding:18px 20px;">
                      ${detailRow('Property', propertyName)}
                      ${detailRow('Address', propertyAddress)}
                      ${detailRow('Inspection Reference', inspectionNo)}
                    </td>
                  </tr>
                </table>
                <p style="margin:24px 0;font-size:16px;line-height:1.6;color:#374151;">
                  The official PDF report — with all findings, photos, inspector comments and repair
                  timelines — is attached to this email and ready to download.
                </p>
                ${
                  reportUrl
                    ? `<table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto;">
                         <tr>
                           <td style="background:#006795;border-radius:6px;">
                             <a href="${escapeHTML(reportUrl)}"
                                style="display:inline-block;padding:16px 34px;font-size:17px;font-weight:bold;color:#ffffff;text-decoration:none;">
                               View Full Report
                             </a>
                           </td>
                         </tr>
                       </table>`
                    : ''
                }
              </td>
            </tr>
            <tr>
              <td style="padding:20px 40px 32px;border-top:1px solid #e5e7eb;">
                <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
                  Generated by NSPIRE Inspection System. This document is confidential and intended for authorized use only.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

// POST /api/inspections/send-report-email — email the generated NSPIRE report PDF to a recipient
export async function POST(req: NextRequest) {
  try {
    const { email, pdfBase64, filename, propertyName, propertyAddress, inspectionNo, reportUrl } = await req.json();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ success: false, message: 'A valid email address is required.' }, { status: 400 });
    }
    if (!pdfBase64) {
      return NextResponse.json({ success: false, message: 'Report PDF data is missing.' }, { status: 400 });
    }
    if (Buffer.byteLength(pdfBase64, 'base64') > MAX_PDF_BYTES) {
      return NextResponse.json({ success: false, message: 'Report PDF is too large to email.' }, { status: 413 });
    }

    const attachmentName = (filename || `NSPIRE_Report_${inspectionNo || 'report'}.pdf`).replace(/[^a-zA-Z0-9_.-]/g, '_');
    const subject = `NSPIRE Inspection Report${propertyName ? ` — ${propertyName}` : ''}`;
    const body = `Attached is the full NSPIRE inspection report${propertyName ? ` for ${propertyName}` : ''}${propertyAddress ? ` (${propertyAddress})` : ''}.${inspectionNo ? `\n\nInspection #${inspectionNo}` : ''}`;
    const htmlBody = buildReportEmailHTML({ propertyName, propertyAddress, inspectionNo, reportUrl });

    // Railway drops outbound SMTP (ports 25/465/587 all time out even on a reachable
    // IPv4 address), so Gmail SMTP can never deliver from here. Brevo's HTTP API goes
    // over 443, which is never blocked — prefer it whenever a key is configured.
    if (process.env.BREVO_API_KEY) {
      // Brevo matches the sender against its verified list as an exact string, so a
      // capitalised EMAIL_USER ("Nspire...@gmail.com") was rejected against the sender
      // verified in lowercase. Addresses are case-insensitive in practice — normalise.
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
          to: [{ email }],
          subject,
          textContent: body,
          htmlContent: htmlBody,
          attachment: [{ content: pdfBase64, name: attachmentName }],
        }),
      });

      if (!res.ok) {
        const detail = await res.text();
        throw new Error(`Email provider rejected the request (${res.status}): ${detail.slice(0, 300)}`);
      }

      return NextResponse.json({ success: true, message: 'Report emailed successfully.' });
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
      to: email,
      subject,
      text: body,
      html: htmlBody,
      attachments: [
        {
          filename: attachmentName,
          content: pdfBase64,
          encoding: 'base64',
          contentType: 'application/pdf',
        },
      ],
    });

    return NextResponse.json({ success: true, message: 'Report emailed successfully.' });
  } catch (error: any) {
    console.error('POST /api/inspections/send-report-email error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to send report email.' }, { status: 500 });
  }
}
