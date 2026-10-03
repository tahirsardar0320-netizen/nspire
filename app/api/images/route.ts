import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'inspire_jwt_secret_key_2024';

function getUserFromToken(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth) return null;
  try {
    return jwt.verify(auth.replace('Bearer ', ''), JWT_SECRET) as any;
  } catch {
    return null;
  }
}

/**
 * Inspection photos used to be carried inside the inspection record as base64
 * data URLs. A single phone photo is several megabytes, base64 adds roughly a
 * third on top, and every save re-sent every photo taken so far — so a document
 * crossed MongoDB's hard 16 MB ceiling after only a few captures and saves
 * started failing outright. That is what made the app feel random: it depended
 * on how many photos an inspector had taken.
 *
 * Photos now live in GridFS, which chunks them into their own collection, and
 * the inspection record only carries a short URL.
 */

export const runtime = 'nodejs';

const MAX_BYTES = 12 * 1024 * 1024;
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp']);
const BUCKET = 'inspectionPhotos';

export async function POST(request: NextRequest) {
  try {
    const decoded = getUserFromToken(request);
    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const form = await request.formData();
    const file = form.get('image');
    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, message: 'No image provided' }, { status: 400 });
    }
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json({ success: false, message: 'Unsupported image type' }, { status: 415 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ success: false, message: 'Image is too large' }, { status: 413 });
    }

    await connectDB();
    const db = mongoose.connection.db;
    if (!db) throw new Error('Database connection is not ready');

    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: BUCKET });
    const buffer = Buffer.from(await file.arrayBuffer());

    const id = await new Promise<string>((resolve, reject) => {
      const upload = bucket.openUploadStream(file.name || 'inspection-photo.jpg', {
        // This driver version carries the type in metadata rather than as a
        // top-level option; the GET route reads it back from there.
        metadata: {
          contentType: file.type,
          uploadedBy: (decoded as any).userId ?? (decoded as any).id ?? null,
          uploadedAt: new Date(),
        },
      });
      upload.on('error', reject);
      upload.on('finish', () => resolve(String(upload.id)));
      upload.end(buffer);
    });

    return NextResponse.json({ success: true, url: `/api/images/${id}`, id });
  } catch (error: any) {
    console.error('Image upload failed:', error);
    return NextResponse.json({ success: false, message: 'Could not store the image' }, { status: 500 });
  }
}
