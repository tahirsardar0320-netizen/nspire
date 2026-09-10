import { connectDB, User, PasswordReset } from '@/lib/db';
import { getTransporter, buildOtpEmailHTML } from '@/lib/mailer';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const OTP_LENGTH = 6;

function generateOtp() {
  // Uniform over 000000-999999; Math.random would be predictable enough to guess.
  return String(crypto.randomInt(0, 10 ** OTP_LENGTH)).padStart(OTP_LENGTH, '0');
}

export type IssueResult =
  | { ok: true }
  | { ok: false; reason: 'no-smtp' | 'send-failed' };

/**
 * Issue a fresh reset code and email it. Shared by the initial request and the
 * resend button so both behave identically.
 *
 * Resolves `ok` for an unknown address as well — the caller must not reveal
 * whether an email is registered.
 */
export async function issueResetCode(email: string): Promise<IssueResult> {
  await connectDB();

  const normalised = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalised });
  if (!user) return { ok: true };

  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 10);

  // One live request per address — issuing a new code invalidates the old.
  await PasswordReset.deleteMany({ email: normalised });
  await PasswordReset.create({ email: normalised, otpHash, createdAt: new Date() });

  const transporter = await getTransporter();
  if (!transporter) {
    console.error('password reset: SMTP credentials are not configured');
    return { ok: false, reason: 'no-smtp' };
  }

  try {
    await transporter.sendMail({
      from: `"NSPIRE Inspection App" <${process.env.EMAIL_USER}>`,
      to: normalised,
      subject: 'Your NSPIRE password reset code',
      html: buildOtpEmailHTML(otp),
      text: `Your NSPIRE password reset code is ${otp}. It expires in 15 minutes.`,
    });
  } catch (error) {
    console.error('password reset: failed to send code', error);
    return { ok: false, reason: 'send-failed' };
  }

  return { ok: true };
}

/** Same wording whether or not the address exists, to avoid enumeration. */
export const GENERIC_ISSUE_MESSAGE =
  'If that email is registered, a verification code is on its way.';
