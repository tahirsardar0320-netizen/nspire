import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const MAX_PDF_BYTES = 15 * 1024 * 1024; // 15MB

function getTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_APP_PASSWORD;
  if (!user || !pass) return null;

  return nodemailer.createTransport({
    // The 'gmail' service preset connects on port 465 (implicit TLS), which Railway's
    // network was blocking outright — connections hung until nodemailer's ETIMEDOUT.
    // Port 587 (STARTTLS) is the port cloud hosts typically leave open for outbound SMTP.
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { user, pass },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 15000,
  });
}

// POST /api/inspections/send-report-email — email the generated NSPIRE report PDF to a recipient
export async function POST(req: NextRequest) {
  try {
    const { email, pdfBase64, filename, propertyName, propertyAddress, inspectionNo } = await req.json();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ success: false, message: 'A valid email address is required.' }, { status: 400 });
    }
    if (!pdfBase64) {
      return NextResponse.json({ success: false, message: 'Report PDF data is missing.' }, { status: 400 });
    }
    if (Buffer.byteLength(pdfBase64, 'base64') > MAX_PDF_BYTES) {
      return NextResponse.json({ success: false, message: 'Report PDF is too large to email.' }, { status: 413 });
    }

    const transporter = getTransporter();
    if (!transporter) {
      return NextResponse.json(
        { success: false, message: 'Email sending is not configured on the server yet.' },
        { status: 503 }
      );
    }

    const attachmentName = (filename || `NSPIRE_Report_${inspectionNo || 'report'}.pdf`).replace(/[^a-zA-Z0-9_.-]/g, '_');

    await transporter.sendMail({
      from: `"NSPIRE Inspection" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `NSPIRE Inspection Report${propertyName ? ` — ${propertyName}` : ''}`,
      text: `Attached is the full NSPIRE inspection report${propertyName ? ` for ${propertyName}` : ''}${propertyAddress ? ` (${propertyAddress})` : ''}.${inspectionNo ? `\n\nInspection #${inspectionNo}` : ''}`,
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
