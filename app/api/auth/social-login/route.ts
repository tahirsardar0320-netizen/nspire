import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { Property } from '@/lib/db';
import { DEFAULT_PROPERTIES } from '@/lib/defaultProperties';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://rminhal783_db_user:pi8fODTUIsdDiKF5@cluster0.ijtzyjr.mongodb.net/?appName=Cluster0';
const JWT_SECRET = process.env.JWT_SECRET || 'inspire_jwt_secret_key_2024';

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

const ROLE_BY_PORTAL: Record<string, string> = {
  Inspector: 'inspector',
  Management: 'management',
  Other: 'other',
};

// POST /api/auth/social-login — sign in (or provision) a user authenticated via Google/Facebook/Apple
export async function POST(req: NextRequest) {
  try {
    const { email, fullName, portal, provider } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required.' }, { status: 400 });
    }

    await connectDB();

    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      user.lastLogin = new Date();
      await user.save();
    } else {
      const role = ROLE_BY_PORTAL[portal] || 'inspector';

      user = await User.create({
        fullName: fullName || email.split('@')[0],
        email: email.toLowerCase(),
        role,
        isEmailVerified: true,
        isActive: true,
        lastLogin: new Date(),
      });

      const userId = String(user._id);
      await Property.insertMany(
        DEFAULT_PROPERTIES.map((p) => ({ ...p, userId, status: 'active' }))
      );

      console.log(`✅ User provisioned via ${provider || 'social'} login:`, user.email);
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error('Social login route error:', error);
    return NextResponse.json({ success: false, message: 'Error signing in. Please try again.', error: error.message }, { status: 500 });
  }
}
