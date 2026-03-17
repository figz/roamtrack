const mongoose = require('mongoose');

// Cache connection across serverless function invocations
let cached = global._mongooseCache;
if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/roamtrack',
      { bufferCommands: false }
    );
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    console.error('MongoDB connection error:', err);
    throw err;
  }

  return cached.conn;
}

module.exports = connectDB;
