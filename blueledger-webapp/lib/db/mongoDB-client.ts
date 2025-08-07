// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { MongoClient, ServerApiVersion } from 'mongodb';
import { env } from '@/env/server';

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
      const client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect().then(() => {
        console.warn('Auth.js connected to MongoDB in development mode');
        return client;
      });
    }

    return globalWithMongo._mongoClientPromise;
  }
  else {
  // In production mode, it's best to not use a global variable.
    const client = new MongoClient(uri, options);
    return client.connect().then(() => {
      console.warn('Auth.js connected to MongoDB in production mode');
      return client;
    });
  }
})();

// Export a module-scoped MongoClient. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
