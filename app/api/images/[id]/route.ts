import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';

// Serves a photo stored by POST /api/images. Reports embed these URLs and are
// also opened from shared links, so this is deliberately readable without a
// token — the id is an unguessable ObjectId, matching how the shared-report
// links already work.

export const runtime = 'nodejs';

const BUCKET = 'inspectionPhotos';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!mongoose.isValidObjectId(params.id)) {
      return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }

    await connectDB();
    const db = mongoose.connection.db;
    if (!db) throw new Error('Database connection is not ready');

    const _id = new mongoose.Types.ObjectId(params.id);
    const file = await db.collection(`${BUCKET}.files`).findOne({ _id });
    if (!file) {
      return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }

    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: BUCKET });
    const chunks: Buffer[] = [];
    await new Promise<void>((resolve, reject) => {
      const stream = bucket.openDownloadStream(_id);
      stream.on('data', (c: Buffer) => chunks.push(c));
      stream.on('error', reject);
      stream.on('end', () => resolve());
    });

    return new NextResponse(Buffer.concat(chunks) as any, {
      headers: {
        'Content-Type': file.metadata?.contentType || file.contentType || 'image/jpeg',
        'Content-Length': String(file.length),
        // Photos are immutable once stored, so they can be cached hard.
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: any) {
    console.error('Image fetch failed:', error);
    return NextResponse.json({ success: false, message: 'Could not load the image' }, { status: 500 });
  }
}
