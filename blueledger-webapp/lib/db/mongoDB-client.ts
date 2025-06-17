// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { MongoClient, ServerApiVersion } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  // eslint-disable-next-line
  let globalWithMongo = global as typeof globalThis & {
    // _mongoClient?: MongoClient;
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect().then(() => {
      console.log('Auth.js connected to MongoDB in development mode');
      return client;
    });
  }

  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  const client = new MongoClient(uri, options);
  clientPromise = client.connect().then(() => {
    console.log('Auth.js connected to MongoDB in production mode');
    return client;
  });
}

// Export a module-scoped MongoClient. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
