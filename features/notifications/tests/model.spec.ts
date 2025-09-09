import mongoose from 'mongoose';
import { describe, expect, it } from 'vitest';
import { NOTIFICATION_TYPES } from '../constants';
import Notification from '../models';

describe('notification model validation', () => {
  const validData = () => ({
    user: new mongoose.Types.ObjectId(),
    fromUser: new mongoose.Types.ObjectId(),
    type: NOTIFICATION_TYPES.FRIEND_REQUEST,
    isRead: false,
  });

  it('should validate a correct document', async () => {
    const doc = new Notification(validData());
    await expect(doc.validate()).resolves.toBeUndefined();
  });

  it('should require user', async () => {
    const doc = new Notification({ ...validData(), user: undefined });
    await expect(doc.validate()).rejects.toThrow();
  });

  it('should require valid user', async () => {
    const doc = new Notification({ ...validData(), user: 'bad' });
    await expect(doc.validate()).rejects.toThrow();
  });

  it('should require fromUser', async () => {
    const doc = new Notification({ ...validData(), fromUser: undefined });
    await expect(doc.validate()).rejects.toThrow();
  });

  it('should require valid fromUser', async () => {
    const doc = new Notification({ ...validData(), fromUser: 'bad' });
    await expect(doc.validate()).rejects.toThrow();
  });

  it('should require type', async () => {
    const doc = new Notification({ ...validData(), type: undefined });
    await expect(doc.validate()).rejects.toThrow();
  });

  it('should require valid type', async () => {
    const doc = new Notification({ ...validData(), type: 'WRONG' });
    await expect(doc.validate()).rejects.toThrow();
  });

  it('should default isRead to false', async () => {
    const doc = new Notification({ ...validData(), isRead: undefined });
    await expect(doc.validate()).resolves.toBeUndefined();
    expect(doc.isRead).toBe(false);
  });
});
