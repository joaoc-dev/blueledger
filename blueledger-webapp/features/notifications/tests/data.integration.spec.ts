import type { CreateNotificationData, PatchNotificationData } from '../schemas';
import mongoose from 'mongoose';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { fullIntegrationTestHooks } from '@/tests/integration-setup/full-integration-setup';
import { NOTIFICATION_TYPES } from '../constants';
import {
  createNotification,
  getNotificationById,
  getNotifications,
  markAllNotificationsAsRead,
  updateNotification,
} from '../data';

// Use the full integration test setup (includes both data and app concerns)
beforeAll(fullIntegrationTestHooks.beforeAll);
beforeEach(fullIntegrationTestHooks.beforeEach);
afterEach(fullIntegrationTestHooks.afterEach);
afterAll(fullIntegrationTestHooks.afterAll);

describe('notifications data - integration tests', () => {
  describe('getNotifications', () => {
    it('should get notifications for a user', async () => {
      const userId = new mongoose.Types.ObjectId();
      const fromUserId = new mongoose.Types.ObjectId();

      await createNotification({
        user: userId.toString(),
        fromUser: fromUserId.toString(),
        type: NOTIFICATION_TYPES.FRIEND_REQUEST,
        isRead: false,
      } as CreateNotificationData);

      await createNotification({
        user: userId.toString(),
        fromUser: fromUserId.toString(),
        type: NOTIFICATION_TYPES.GROUP_INVITE,
        isRead: false,
      } as CreateNotificationData);

      const notifications = await getNotifications(userId.toString());
      expect(notifications.length).toBe(2);
      expect(notifications[0]?.type).toBe(NOTIFICATION_TYPES.GROUP_INVITE);
      expect(notifications[1]?.type).toBe(NOTIFICATION_TYPES.FRIEND_REQUEST);
    });

    it('should only get name and image of user and fromUser', async () => {
      const userId = new mongoose.Types.ObjectId();
      const fromUserId = new mongoose.Types.ObjectId();

      await createNotification({
        user: userId.toString(),
        fromUser: fromUserId.toString(),
        type: NOTIFICATION_TYPES.FRIEND_REQUEST,
        isRead: false,
      } as CreateNotificationData);

      const notifications = await getNotifications(userId.toString());
      expect(notifications.length).toBe(1);
      expect(notifications[0]?.fromUser).toBeDefined();
      expect(notifications[0]?.user).toBeDefined();
      // ids should not be returned
      expect(notifications[0]?.fromUser?.id).not.toBeDefined();
      expect(notifications[0]?.user?.id).not.toBeDefined();
      expect(notifications[0]?.fromUser?.name).toBeDefined();
      expect(notifications[0]?.fromUser?.image).toBeDefined();
      expect(notifications[0]?.user?.name).toBeDefined();
      expect(notifications[0]?.user?.image).toBeDefined();
    });

    it('should not get notifications for a different user', async () => {
      const userId = new mongoose.Types.ObjectId();
      const differentUserId = new mongoose.Types.ObjectId();

      await createNotification({
        user: userId.toString(),
        fromUser: differentUserId.toString(),
        type: NOTIFICATION_TYPES.FRIEND_REQUEST,
        isRead: false,
      } as CreateNotificationData);

      await createNotification({
        user: differentUserId.toString(),
        fromUser: userId.toString(),
        type: NOTIFICATION_TYPES.GROUP_INVITE,
        isRead: false,
      } as CreateNotificationData);

      const notifications = await getNotifications(userId.toString());
      expect(notifications.length).toBe(1);
      expect(notifications[0]?.type).toBe(NOTIFICATION_TYPES.FRIEND_REQUEST);
      expect(notifications[0]?.isRead).toBe(false);
    });
  });

  describe('createNotification', () => {
    it('should create notification', async () => {
      const userId = new mongoose.Types.ObjectId();
      const fromUserId = new mongoose.Types.ObjectId();

      const notification = await createNotification({
        user: userId.toString(),
        fromUser: fromUserId.toString(),
        type: NOTIFICATION_TYPES.FRIEND_REQUEST,
        isRead: false,
      } as CreateNotificationData);

      expect(notification).toBeDefined();
      expect(notification.id).toBeDefined();
      expect(notification.user).toBeDefined();
      expect(notification.fromUser).toBeDefined();
      expect(notification.type).toBe(NOTIFICATION_TYPES.FRIEND_REQUEST);
      expect(notification.isRead).toBe(false);
    });
  });

  describe('getNotificationById', () => {
    it('should get notification by id', async () => {
      const userId = new mongoose.Types.ObjectId();
      const fromUserId = new mongoose.Types.ObjectId();

      const created = await createNotification({
        user: userId.toString(),
        fromUser: fromUserId.toString(),
        type: NOTIFICATION_TYPES.FRIEND_REQUEST,
        isRead: false,
      } as CreateNotificationData);

      const found = await getNotificationById(created.id!);
      expect(found).not.toBeNull();
      expect(found?.id).toBe(created.id);
      expect(found?.type).toBe(NOTIFICATION_TYPES.FRIEND_REQUEST);
      expect(found?.user).toBeDefined();
      expect(found?.fromUser).toBeDefined();
      expect(found?.user?.id).not.toBeDefined();
      expect(found?.fromUser?.id).not.toBeDefined();
      expect(found?.user?.name).toBeDefined();
      expect(found?.fromUser?.name).toBeDefined();
      expect(found?.user?.image).toBeDefined();
      expect(found?.fromUser?.image).toBeDefined();
    });

    it('should return null for non-existent notification', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const found = await getNotificationById(fakeId);
      expect(found).toBeNull();
    });

    it('should return null for invalid notification id', async () => {
      const found = await getNotificationById('invalid-id');
      expect(found).toBeNull();
    });
  });

  describe('updateNotification', () => {
    it('should update notification', async () => {
      const userId = new mongoose.Types.ObjectId();
      const fromUserId = new mongoose.Types.ObjectId();

      const created = await createNotification({
        user: userId.toString(),
        fromUser: fromUserId.toString(),
        type: NOTIFICATION_TYPES.FRIEND_REQUEST,
        isRead: false,
      } as CreateNotificationData);

      const updated = await updateNotification({
        id: created.id!,
        data: { isRead: true },
      } as PatchNotificationData);

      expect(updated).not.toBeNull();
      expect(updated?.id).toBe(created.id);
      expect(updated?.isRead).toBe(true);
    });

    it('should return null when updating non-existent notification', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      const updated = await updateNotification({
        id: fakeId,
        data: { isRead: true },
      } as PatchNotificationData);

      expect(updated).toBeNull();
    });
  });

  describe('markAllNotificationsAsRead', () => {
    it('should mark all notifications as read', async () => {
      const userId = new mongoose.Types.ObjectId();
      const fromUserId = new mongoose.Types.ObjectId();

      // Create multiple unread notifications
      await createNotification({
        user: userId,
        fromUser: fromUserId,
        type: 'FRIEND_REQUEST',
        isRead: false,
      } as any);

      await createNotification({
        user: userId,
        fromUser: fromUserId,
        type: 'ADDED_TO_EXPENSE',
        isRead: false,
      } as any);

      // Mark all as read
      await markAllNotificationsAsRead(userId.toString());

      const notifications = await getNotifications(userId.toString());
      expect(notifications.every(n => n.isRead)).toBe(true);
    });
  });
});
