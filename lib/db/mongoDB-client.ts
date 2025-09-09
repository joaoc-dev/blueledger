// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import * as Sentry from '@sentry/nextjs';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { LogEvents } from '@/constants/log-events';
import { env } from '@/env/server';
import { createLogger } from '@/lib/logger';

if (!env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = env.MONGODB_URI;
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

const clientPromise: Promise<MongoClient> = (() => {
  if (process.env.NODE_ENV === 'development') {
    // Use global variable in dev to preserve across HMR
    const globalWithMongo = globalThis as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      const logger = createLogger('lib/db/mongo');
      const client = new MongoClient(uri, options);
      const start = Date.now();

      logger.info(LogEvents.DB_CONNECT_START);

      globalWithMongo._mongoClientPromise = client.connect()
        .then(() => {
          logger.info(LogEvents.DB_CONNECT_SUCCESS, { durationMs: Date.now() - start });
          return client;
        })
        .catch((error) => {
          Sentry.captureException(error);

          logger.error(LogEvents.DB_CONNECT_FAILED, {
            error: error instanceof Error ? error.message : 'Unknown error',
          });

          throw error;
        });
    }

    return globalWithMongo._mongoClientPromise;
  }
  else {
  // In production mode, it's best to not use a global variable.
    const logger = createLogger('lib/db/mongo');
    const client = new MongoClient(uri, options);
    const start = Date.now();

    logger.info(LogEvents.DB_CONNECT_START);

    return client.connect()
      .then(() => {
        logger.info(LogEvents.DB_CONNECT_SUCCESS, { durationMs: Date.now() - start });
        return client;
      })
      .catch((error) => {
        Sentry.captureException(error);

        logger.error(LogEvents.DB_CONNECT_FAILED, {
          error: error instanceof Error ? error.message : 'Unknown error',
        });

        throw error;
      });
  }
})();

// Export a module-scoped MongoClient. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
