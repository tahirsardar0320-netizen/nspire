import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Property } from '@/lib/db';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'inspire_jwt_secret_key_2024';

function getUserFromToken(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth) return null;
  const token = auth.replace('Bearer ', '');
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch {
    return null;
  }
}

// GET /api/properties — list all properties for the authenticated user
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = getUserFromToken(req);
    if (!user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const state = searchParams.get('state') || '';
    const city = searchParams.get('city') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');

    // Match userId stored as either a string or as an ObjectId
    const userId = String(user.id);
    const filter: any = mongoose.isValidObjectId(userId)
      ? { $or: [{ userId: userId }, { userId: new mongoose.Types.ObjectId(userId) }] }
      : { userId: userId };
    if (search) {
      const searchConditions = [
        { name: { $regex: search, $options: 'i' } },
        { propertyId: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ];
      // Merge search with existing $or if present
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: searchConditions }];
        delete filter.$or;
      } else {
        filter.$or = searchConditions;
      }
    }
    if (state) filter.state = { $regex: `^${state}$`, $options: 'i' };
    if (city) filter.city = { $regex: `^${city}$`, $options: 'i' };

    const total = await Property.countDocuments(filter);
    const properties = await Property.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      properties,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    console.error('GET /api/properties error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST /api/properties — create a property
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = getUserFromToken(req);
    const body = await req.json();

    // Store userId as a plain string so it matches the JWT payload consistently
    const property = await Property.create({
      ...body,
      // The "Property ID" field is optional in the UI — auto-generate one when left blank
      propertyId: body.propertyId?.trim() || `PRP-${Date.now().toString().slice(-9)}`,
      userId: user?.id ? String(user.id) : null,
    });

    return NextResponse.json({
      success: true,
      message: 'Property created successfully',
      property,
    }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/properties error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
