import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Property } from '@/lib/db';
import { DEFAULT_PROPERTIES } from '@/lib/defaultProperties';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://rminhal783_db_user:pi8fODTUIsdDiKF5@cluster0.ijtzyjr.mongodb.net/?appName=Cluster0';
const JWT_SECRET = process.env.JWT_SECRET || 'inspire_jwt_secret_key_2024';

// Connect to MongoDB (reuse connection)
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(MONGODB_URI);
  isConnected = true;
}

// Inline User schema (mirrors the backend model)
const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true, lowercase: true },
  password: String,
  role: { type: String, default: 'inspector' },
  isEmailVerified: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, password, role } = await req.json();

    // Basic validation
    if (!fullName || !email || !password) {
      return NextResponse.json({ success: false, message: 'Full name, email and password are required.' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ success: false, message: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    await connectDB();

    // Check if email already registered
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ success: false, message: 'Email already registered. Please log in.' }, { status: 400 });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 12);

    // Create user — auto-verified, no OTP
    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      password: hashed,
      role: role || 'inspector',
      isEmailVerified: true,
      isActive: true,
      lastLogin: new Date(),
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Give every new inspector their own copy of the baseline properties,
    // created the same way a manually-added property is.
    const userId = String(user._id);
    await Property.insertMany(
      DEFAULT_PROPERTIES.map((p) => ({ ...p, userId, status: 'active' }))
    );

    console.log('✅ User registered via Next.js route (no verification):', user.email);

    return NextResponse.json({
      success: true,
      message: 'Account created successfully. You can now log in.',
      requiresVerification: false,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Register route error:', error);
    return NextResponse.json({ success: false, message: 'Error creating account. Please try again.', error: error.message }, { status: 500 });
  }
}
