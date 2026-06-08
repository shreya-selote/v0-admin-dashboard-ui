import mongoose from "mongoose";

/**
 * Cache the connection across hot-reloads in development. Without this, every
 * change would create a brand new connection to the database, quickly
 * exhausting the connection limit.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB(): Promise<typeof mongoose> {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local"
    );
  }

  // Reuse an existing connection if one is already established.
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
      // Pin the database name so the app always uses "autohub" even if the
      // connection string omits it (otherwise Mongo defaults to "test").
      dbName: "autohub",
    };

    cached!.promise = mongoose
      .connect(MONGODB_URI as string, opts)
      .then((mongooseInstance) => {
        console.log("[v0] MongoDB connected to database:", mongooseInstance.connection.name);
        return mongooseInstance;
      });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (error) {
    // Reset the promise so a future call can retry the connection.
    cached!.promise = null;
    console.error("[v0] MongoDB connection error:", error);
    throw error;
  }

  return cached!.conn;
}

export default connectDB;
