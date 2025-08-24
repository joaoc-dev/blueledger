import mongoose from 'mongoose';
import { afterEach, describe, expect } from 'vitest';
import { db } from '@/tests/mocks/db';
import { setMockAuthenticatedUser } from '@/tests/mocks/handlers/users';
import { test } from '@/tests/test-extend';
import { HTTP_VERB, simulateError } from '@/tests/utils';
import { getUser, updateUser, updateUserImage } from '../client';

describe('users client (browser)', () => {
  // Clean up after each test to ensure isolation
  afterEach(() => {
    db.user.deleteMany({ where: {} });
    // Reset mock authenticated user
    setMockAuthenticatedUser(null);
  });

  describe('get user', () => {
    test('should get user successfully', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      setMockAuthenticatedUser(userId);

      const userData = {
        id: userId,
        name: 'John Doe',
        email: 'john@example.com',
        image: 'https://example.com/avatar.jpg',
        imagePublicId: 'avatar123',
        bio: 'Software developer',
        emailVerified: new Date(),
      };

      db.user.create(userData);

      const user = await getUser();
      expect(user).toBeDefined();
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
      expect(user.image).toBe('https://example.com/avatar.jpg');
      expect(user.bio).toBe('Software developer');
      expect(user.emailVerified).toBeInstanceOf(Date);
    });

    test('should return 401 when user is not authenticated', async () => {
      // Don't set any authenticated user
      setMockAuthenticatedUser(null);

      // Create a user in the database
      db.user.create({
        id: new mongoose.Types.ObjectId().toString(),
        name: 'John Doe',
        email: 'john@example.com',
        bio: 'Software developer',
      });

      // Should throw error when not authenticated (401 Unauthorized)
      await expect(getUser()).rejects.toThrow();
    });

    test('should handle get user error (401 unauthorized)', async ({ worker }) => {
      const userId = new mongoose.Types.ObjectId().toString();
      setMockAuthenticatedUser(userId);

      simulateError(worker, HTTP_VERB.GET, '/api/users/me', 401);

      await expect(getUser()).rejects.toThrow();
    });
  });

  describe('update user', () => {
    test('should update user successfully', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      setMockAuthenticatedUser(userId);

      const originalUser = db.user.create({
        id: userId,
        name: 'John Doe',
        email: 'john@example.com',
        bio: 'Original bio',
      });

      const updateData = {
        name: 'John Smith',
        email: 'john@example.com',
        bio: 'Updated bio',
      };

      const updated = await updateUser(updateData);
      expect(updated).toBeDefined();
      expect(updated.name).toBe('John Smith');
      expect(updated.email).toBe('john@example.com');
      expect(updated.bio).toBe('Updated bio');
      expect(updated.id).toBe(originalUser.id);
    });

    test('should handle update user error (validation error)', async ({ worker }) => {
      const userId = new mongoose.Types.ObjectId().toString();
      setMockAuthenticatedUser(userId);

      const updateData = {
        name: '', // Invalid: empty name
        email: 'john@example.com',
        bio: 'Updated bio',
      };

      simulateError(worker, HTTP_VERB.PATCH, '/api/users/me', 400);

      await expect(updateUser(updateData)).rejects.toThrow();
    });
  });

  describe('update user image', () => {
    test('should update user image successfully', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      setMockAuthenticatedUser(userId);

      db.user.create({
        id: userId,
        name: 'John Doe',
        email: 'john@example.com',
        image: 'https://example.com/old-avatar.jpg',
        imagePublicId: 'old-avatar-123',
      });

      // Create a mock image blob
      const imageBlob = new Blob(['fake image data'], { type: 'image/jpeg' });

      const updated = await updateUserImage(imageBlob);
      expect(updated).toBeDefined();
      expect(updated.name).toBe('John Doe');
      expect(updated.email).toBe('john@example.com');
      expect(updated.image).toBe('https://example.com/uploaded-avatar.jpg');
    });

    test('should remove user image when passing null', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      setMockAuthenticatedUser(userId);

      db.user.create({
        id: userId,
        name: 'John Doe',
        email: 'john@example.com',
        image: 'https://example.com/avatar.jpg',
        imagePublicId: 'avatar123',
      });

      const updated = await updateUserImage(null);
      expect(updated).toBeDefined();
      expect(updated.image).toBe('');
      expect(updated.imagePublicId).toBe('');
    });
  });

  test('should handle API errors', async ({ worker }) => {
    const userId = 'test-user-id';
    setMockAuthenticatedUser(userId);

    simulateError(worker, HTTP_VERB.GET, '/api/users/me', 500);

    await expect(getUser()).rejects.toThrow();
  });
});
