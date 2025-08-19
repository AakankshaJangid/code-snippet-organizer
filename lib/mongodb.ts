import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("⚠️ Please define the MONGODB_URI in .env.local");
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Global cache so hot reload in dev doesn't open multiple connections
const cached: MongooseCache = (global as typeof globalThis & { mongoose?: MongooseCache }).mongoose || {
  conn: null,
  promise: null,
};

if (!(global as typeof globalThis & { mongoose?: MongooseCache }).mongoose) {
  (global as typeof globalThis & { mongoose?: MongooseCache }).mongoose = cached;
}

export async function connectDB(): Promise<Mongoose> {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
