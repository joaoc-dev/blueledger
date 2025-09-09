import type {
  CreateNotificationData,
  PatchNotificationData,
} from '../schemas';
import { Types } from 'mongoose';
import { beforeEach, describe, expect, it } from 'vitest';
import { NOTIFICATION_TYPES } from '../constants';
import {
  createNotificationSchema,
  patchNotificationSchema,
} from '../schemas';

const validObjectId = new Types.ObjectId().toHexString();

describe('notifications schemas', () => {
  describe('createNotificationSchema', () => {
    let validData: CreateNotificationData;

    beforeEach(() => {
      validData = {
        user: validObjectId,
        fromUser: validObjectId,
        type: NOTIFICATION_TYPES.FRIEND_REQUEST,
        isRead: false,
      };
    });

    it('should accept valid data', () => {
      expect(() => createNotificationSchema.parse(validData)).not.toThrow();
    });

    it('should reject invalid user ID', () => {
      const data: CreateNotificationData = { ...validData, user: 'bad' };
      expect(() => createNotificationSchema.parse(data)).toThrow();
    });

    it('should reject invalid fromUser ID', () => {
      const data: CreateNotificationData = { ...validData, fromUser: 'bad' };
      expect(() => createNotificationSchema.parse(data)).toThrow();
    });

    it('should reject invalid type', () => {
      const data: CreateNotificationData = { ...validData, type: 'WRONG_TYPE' as any };
      expect(() => createNotificationSchema.parse(data)).toThrow();
    });

    it('should reject invalid isRead', () => {
      const data: CreateNotificationData = { ...validData, isRead: 'yes' as any };
      expect(() => createNotificationSchema.parse(data)).toThrow();
    });

    it('should reject extra fields', () => {
      const data: CreateNotificationData & { extra?: string } = {
        ...validData,
        extra: 'not allowed',
      };
      expect(() => createNotificationSchema.parse(data)).toThrow();
    });
  });

  describe('patchNotificationSchema', () => {
    it('should accept valid id and data', () => {
      const data: PatchNotificationData = {
        id: validObjectId,
        data: { isRead: true },
      };
      expect(() => patchNotificationSchema.parse(data)).not.toThrow();
    });

    it('should reject invalid id', () => {
      const data = { id: 'bad', data: { isRead: true } } as PatchNotificationData;
      expect(() => patchNotificationSchema.parse(data)).toThrow();
    });
  });
});
