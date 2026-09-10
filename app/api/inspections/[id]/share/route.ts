import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Inspection, ReportShare } from '@/lib/db';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'inspire_jwt_secret_key_2024';
const SHARE_DAYS = 30;

// Creates the public link behind the Share button on the management reports
// page. Neither this route nor its /shared/[token] counterpart existed, so
// sharing failed and the shared-report page had nothing to load.

function getUserFromToken(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth) return null;
  try {
    return jwt.verify(auth.replace('Bearer ', ''), JWT_SECRET) as any;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const user = getUserFromToken(req);
    if (!user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ success: false, message: 'Invalid report id.' }, { status: 400 });
    }

    const inspection = await Inspection.findById(params.id);
    if (!inspection) {
      return NextResponse.json({ success: false, message: 'Report not found.' }, { status: 404 });
    }

    // The token is the whole credential for an unauthenticated reader, so it
    // gets 32 bytes of CSPRNG entropy rather than anything guessable.
    const token = crypto.randomBytes(32).toString('hex');
    const share = await ReportShare.create({
      token,
      inspectionId: inspection._id,
      createdBy: user.id,
      createdAt: new Date(),
    });

    const origin = req.nextUrl.origin;
    const expiresAt = new Date(share.createdAt.getTime() + SHARE_DAYS * 24 * 60 * 60 * 1000);

    return NextResponse.json({
      success: true,
      message: 'Share link created',
      shareUrl: `${origin}/shared-report/${token}`,
      expiresAt: expiresAt.toISOString(),
    }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/inspections/[id]/share error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to create share link.' }, { status: 500 });
  }
}
