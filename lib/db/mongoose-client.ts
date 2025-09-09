import * as Sentry from '@sentry/nextjs';
import mongoose from 'mongoose';
import { LogEvents } from '@/constants/log-events';
import { env } from '@/env/server';
import { createLogger } from '@/lib/logger';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line vars-on-top
  var mongoose: MongooseCache;
}

let cached = globalThis.mongoose;

if (!cached) {
  cached = globalThis.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  const logger = createLogger('lib/db/mongoose');
  const MONGODB_URI = env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local',
    );
  }

  if (cached.conn) {
    logger.info(LogEvents.DB_CONNECT_REUSE);
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    const start = Date.now();

    logger.info(LogEvents.DB_CONNECT_START);

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseConn) => {
      logger.info(LogEvents.DB_CONNECT_SUCCESS, { durationMs: Date.now() - start });
      return mongooseConn;
    });
  }
  try {
    cached.conn = await cached.promise;
  }
  catch (e) {
    cached.promise = null;

    Sentry.captureException(e);

    logger.error(LogEvents.DB_CONNECT_FAILED, {
      error: e instanceof Error ? e.message : 'Unknown error',
    });
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
