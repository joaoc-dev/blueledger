import mongoose from 'mongoose';
import { describe, expect, it } from 'vitest';
import { mapModelToDisplay } from '../mapper-server';

const modelId = new mongoose.Types.ObjectId().toString();

describe('mapper-server', () => {
  const model: any = {
    _id: modelId,
    name: 'John Doe',
    email: 'john@example.com',
    image: 'profile.jpg',
    imagePublicId: 'public-id-123',
    bio: 'Software developer',
    emailVerified: new Date('2025-01-01T00:00:00.000Z'),
    toObject() { return this; },
  };

  describe('mapModelToDisplay', () => {
    it('converts _id to string id', () => {
      const display = mapModelToDisplay(model);
      expect(display.id).toBe(modelId.toString());
    });

    it('copies over fields correctly', () => {
      const display = mapModelToDisplay(model);
      expect(display.name).toBe('John Doe');
      expect(display.email).toBe('john@example.com');
      expect(display.image).toBe('profile.jpg');
      expect(display.imagePublicId).toBe('public-id-123');
      expect(display.bio).toBe('Software developer');
      expect(display.emailVerified).toBeInstanceOf(Date);
      expect(display.emailVerified?.toISOString()).toBe('2025-01-01T00:00:00.000Z');
    });
  });
});
