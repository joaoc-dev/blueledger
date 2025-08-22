import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { vi } from 'vitest';

vi.mock('@/lib/db/mongoose-client', () => ({
  default: vi.fn().mockResolvedValue(undefined),
}));

let mongoServer: MongoMemoryServer;

export async function setupMongoMemoryServer() {
  // Start in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Disconnect any existing connections
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  // Connect mongoose to the in-memory database
  await mongoose.connect(mongoUri);

  return mongoServer;
}

export async function clearDatabase() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key]?.deleteMany({});
  }
}

export async function teardownMongoMemoryServer() {
  // Clean up connections
  await mongoose.disconnect();
  await mongoServer.stop();
}

export const dataIntegrationTestHooks = {
  beforeAll: async () => {
    await setupMongoMemoryServer();
  },

  beforeEach: async () => {
    await clearDatabase();
  },

  afterEach: async () => {
    // Optional: Add any additional cleanup here
  },

  afterAll: async () => {
    await teardownMongoMemoryServer();
  },
};
