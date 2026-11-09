import { NextRequest, NextResponse } from 'next/server';
import { connectDB, ReportUnlock } from '@/lib/db';

// Has this inspection's full report been paid for?
export async function GET(_req: NextRequest, { params }: { params: { inspectionId: string } }) {
  try {
    await connectDB();
    const row = await ReportUnlock.findOne({ inspectionId: params.inspectionId }).lean();
    return NextResponse.json({ success: true, isReportUnlocked: !!(row as any)?.paid });
  } catch (error: any) {
    console.error('GET /api/payments/check-unlock error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
