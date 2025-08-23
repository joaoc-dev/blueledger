import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { vi } from 'vitest';

// Import models to register them
import '@/features/users/model';
import '@/features/notifications/model';
import '@/features/expenses/model';

vi.mock('@/lib/db/mongoose-client', () => ({
  default: vi.fn().mockResolvedValue(undefined),
}));

let mongoServer: MongoMemoryServer;

async function setupMongoMemoryServer() {
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

async function clearDatabase() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key]?.deleteMany({});
  }
}

async function teardownMongoMemoryServer() {
  // Clean up connections
  await mongoose.disconnect();
  await mongoServer.stop();
}

/**
 * Helper function to register all Mongoose models needed for integration tests.
 * This ensures that models are available for queries that use .populate()
 */
async function registerModels(): Promise<void> {
  // Models are automatically registered when imported
  // This function ensures they're available for tests
  const models = ['User', 'Notification', 'Expense'];

  for (const modelName of models) {
    if (!mongoose.models[modelName]) {
      throw new Error(`Model ${modelName} was not registered properly`);
    }
  }
}

export const dataIntegrationTestHooks = {
  beforeAll: async () => {
    await setupMongoMemoryServer();
    await registerModels(); // Ensure models are registered
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
