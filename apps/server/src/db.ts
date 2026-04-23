import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

export async function connectDB(): Promise<void> {
  if (!MONGODB_URI) {
    console.warn('[DB] MONGODB_URI not set — skipping database connection');
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[DB] Connected to MongoDB');
  } catch (err) {
    console.error('[DB] Connection failed (server will continue without DB):',
      (err as Error).message);
  }
}

export default mongoose;
