import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://rminhal783_db_user:pi8fODTUIsdDiKF5@cluster0.ijtzyjr.mongodb.net/?appName=Cluster0';

let isConnected = false;
let lastConnectionAttempt = 0;
const RETRY_COOLING_PERIOD_MS = 20000; // 20 seconds cooling period

export async function connectDB() {
  // mongoose.connection.readyState: 1 = connected. Don't trust a stale `isConnected`
  // flag alone — on serverless the underlying connection can drop between invocations.
  if (isConnected && mongoose.connection.readyState === 1) return;

  const now = Date.now();
  if (now - lastConnectionAttempt < RETRY_COOLING_PERIOD_MS) {
    console.warn(`⚠️ MongoDB connection in cooling period. Skipping connect attempt to prevent blocking.`);
    throw new Error('Database connection is temporarily unavailable');
  }

  try {
    lastConnectionAttempt = now;
    isConnected = false;
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,  // serverless cold starts need more headroom than 2s
      connectTimeoutMS: 8000,
      socketTimeoutMS: 10000,
    });
    isConnected = true;
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

// ── Property Schema ──
const propertySchema = new mongoose.Schema({
  propertyId: { type: String, required: true },
  name: { type: String, required: true },
  address: String,
  city: String,
  state: String,
  zipCode: String,
  buildings: { type: Number, default: 1 },
  units: { type: Number, default: 1 },
  status: { type: String, default: 'active' },
  userId: { type: String, default: null },  // stored as string to match JWT payload
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const Property = mongoose.models.Property || mongoose.model('Property', propertySchema);

// ── User Schema ──
const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true, lowercase: true },
  password: String,
  phone: String,
  role: { type: String, default: 'inspector' },
  language: { type: String, default: 'English' },
  timezone: { type: String, default: 'EST' },
  emailNotifications: {
    type: {
      inspectionReminders: { type: Boolean, default: true },
      reportCompletion: { type: Boolean, default: true },
      followUpTasks: { type: Boolean, default: false },
      systemUpdates: { type: Boolean, default: true },
    },
    default: () => ({}),
  },
  inAppNotifications: {
    type: {
      inspectionReminders: { type: Boolean, default: true },
      reportCompletion: { type: Boolean, default: true },
      followUpTasks: { type: Boolean, default: true },
      systemUpdates: { type: Boolean, default: false },
    },
    default: () => ({}),
  },
  isEmailVerified: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);

// ── Inspection Schema ──
const inspectionSchema = new mongoose.Schema({
  // A pre-existing unique index on this field predates this schema — it must be
  // set to a unique value on every insert or MongoDB rejects the second-ever
  // document with a duplicate-key error on inspectionId: null.
  inspectionId: { type: String, unique: true, sparse: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  inspectorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  inspectionType: String,
  unitId: String,
  buildingId: String,
  status: { type: String, default: 'in-progress' },
  responses: mongoose.Schema.Types.Mixed,
  inspectionData: mongoose.Schema.Types.Mixed,
  data: mongoose.Schema.Types.Mixed,
  completedAt: Date,
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const Inspection = mongoose.models.Inspection || mongoose.model('Inspection', inspectionSchema);
