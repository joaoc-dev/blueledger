import mongoose from 'mongoose';
import { describe, expect, it } from 'vitest';
import { NOTIFICATION_TYPES } from '../constants';
import { mapModelToDisplay } from '../mapper-server';

const modelId = new mongoose.Types.ObjectId();
const userId = new mongoose.Types.ObjectId();
const fromUserId = new mongoose.Types.ObjectId();

describe('mapper-server', () => {
  const model: any = {
    _id: modelId,
    user: {
      _id: userId,
      name: 'User One',
      image: 'image1.jpg',
    },
    fromUser: {
      _id: fromUserId,
      name: 'User Two',
      image: 'image2.jpg',
    },
    type: NOTIFICATION_TYPES.FRIEND_REQUEST,
    isRead: false,
    createdAt: new Date('2025-01-02T00:00:00.000Z'),
    updatedAt: new Date('2025-01-03T00:00:00.000Z'),
    toObject() { return this; },
  };

  describe('mapModelToDisplay', () => {
    it('should convert _id to string id', () => {
      const display = mapModelToDisplay(model);
      expect(display.id).toBe(modelId.toString());
    });

    it('should remove users ids from the return object', () => {
      const display = mapModelToDisplay(model);
      expect(display.user).not.toHaveProperty('_id');
      expect(display.user).not.toHaveProperty('id');
      expect(display.fromUser).not.toHaveProperty('_id');
      expect(display.fromUser).not.toHaveProperty('id');
    });

    it('maps user to display format', () => {
      const display = mapModelToDisplay(model);
      expect(display.user).toEqual({
        name: 'User One',
        image: 'image1.jpg',
      });
    });

    it('maps fromUser to display format', () => {
      const display = mapModelToDisplay(model);
      expect(display.fromUser).toEqual({
        name: 'User Two',
        image: 'image2.jpg',
      });
    });

    it('handles missing user fields gracefully', () => {
      const modelWithMissingFields = {
        ...model,
        user: { ...model.user, name: undefined, image: undefined },
        fromUser: { ...model.fromUser, name: undefined, image: undefined },
      };

      const display = mapModelToDisplay(modelWithMissingFields);
      expect(display.user).toEqual({
        name: '',
        image: '',
      });
      expect(display.fromUser).toEqual({
        name: '',
        image: '',
      });
    });

    it('copies over primitive fields correctly', () => {
      const display = mapModelToDisplay(model);
      expect(display.type).toBe(NOTIFICATION_TYPES.FRIEND_REQUEST);
      expect(display.isRead).toBe(false);
      expect(display.createdAt).toBeInstanceOf(Date);
      expect(display.updatedAt).toBeInstanceOf(Date);
    });
  });
});
