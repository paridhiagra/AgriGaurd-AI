import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('localhost') || uri.includes('MY_MONGODB_URI')) {
    console.log('AgriGuard AI initialized in demo in-memory storage mode.');
    return false;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000,
    });
    isConnected = true;
    console.log('Connected to MongoDB database.');
    return true;
  } catch (err) {
    isConnected = false;
    try {
      await mongoose.disconnect();
    } catch (_) {}
    console.log('AgriGuard AI initialized in demo in-memory storage mode.');
    return false;
  }
}

export function isDbConnected() {
  return isConnected;
}
