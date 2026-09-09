import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { isInspectorType, inspectorTypeLabel } from '@/lib/inspectorTypes';

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
  inspectorType: { type: String, default: null },
  isEmailVerified: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

// Which stored roles may sign in through each portal. Accounts are provisioned
// per-portal at signup, so an inspector must not be able to sign in through the
// management or other portal just because their password is correct.
const ROLES_BY_PORTAL: Record<string, string[]> = {
  inspector: ['inspector'],
  management: ['management', 'property-manager', 'supervisor'],
  other: ['other'],
  admin: ['admin'],
};

const PORTAL_LABELS: Record<string, string> = {
  inspector: 'Inspector',
  management: 'Management',
  other: 'Other',
  admin: 'Admin',
};

export async function POST(req: NextRequest) {
  try {
    const { email, password, role, inspectorType } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password are required.' }, { status: 400 });
    }

    await connectDB();

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid email or password.' }, { status: 401 });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'Invalid email or password.' }, { status: 401 });
    }

    // Enforce that the account belongs to the portal it is signing in through.
    // Admins are superusers and may sign in anywhere.
    const allowedRoles = role ? ROLES_BY_PORTAL[role] : undefined;
    if (allowedRoles && user.role !== 'admin' && !allowedRoles.includes(user.role)) {
      const portalLabel = PORTAL_LABELS[role] || role;
      return NextResponse.json({
        success: false,
        message: `This account is not registered for the ${portalLabel} portal. Please sign in through the correct portal.`,
      }, { status: 403 });
    }

    // The Other portal is split into inspector categories, and an account
    // belongs to the one it signed up under. Accounts created before the
    // portal recorded a category have none stored, so they stay usable through
    // any lane rather than being locked out of all four.
    if (user.inspectorType && isInspectorType(inspectorType) && user.inspectorType !== inspectorType) {
      return NextResponse.json({
        success: false,
        message: `This account is registered as a ${inspectorTypeLabel(user.inspectorType)}. Please sign in under that inspector type.`,
      }, { status: 403 });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ User logged in via Next.js route:', user.email);

    return NextResponse.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        inspectorType: user.inspectorType,
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error('Login route error:', error);
    return NextResponse.json({ success: false, message: 'Error logging in. Please try again.', error: error.message }, { status: 500 });
  }
}
