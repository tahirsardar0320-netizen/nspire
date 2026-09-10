import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Inspection, ReportShare } from '@/lib/db';

// Serves a shared report to someone with the link but no account. Deliberately
// unauthenticated — the token is the credential — so it returns only the report
// itself and never the sharer's account details.

export async function GET(_req: NextRequest, { params }: { params: { token: string } }) {
  try {
    await connectDB();

    const token = params.token || '';
    if (!/^[a-f0-9]{64}$/.test(token)) {
      return NextResponse.json({ success: false, message: 'This share link is not valid.' }, { status: 400 });
    }

    const share = await ReportShare.findOne({ token });
    if (!share) {
      // Expired shares are removed by the TTL index, so a miss covers both.
      return NextResponse.json(
        { success: false, message: 'This share link has expired or been revoked.' },
        { status: 404 }
      );
    }

    const inspection = await Inspection.findById(share.inspectionId)
      .populate('propertyId', 'propertyId name address city state zipCode buildings units');

    if (!inspection) {
      return NextResponse.json({ success: false, message: 'The shared report is no longer available.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, inspection });
  } catch (error: any) {
    console.error('GET /api/inspections/shared/[token] error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to load the shared report.' }, { status: 500 });
  }
}
