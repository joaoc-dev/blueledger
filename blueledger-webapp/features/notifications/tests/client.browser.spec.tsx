import mongoose from 'mongoose';
import { http, HttpResponse } from 'msw';
import { afterEach, describe, expect } from 'vitest';
import { db } from '@/tests/mocks/db';
import { setMockAuthenticatedUser } from '@/tests/mocks/handlers/notifications';
import { test } from '@/tests/test-extend';
import { HTTP_VERB, simulateError } from '@/tests/utils';
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../client';
import { NOTIFICATION_TYPES } from '../constants';

describe('notifications client (browser)', () => {
  // Clean up after each test to ensure isolation
  afterEach(() => {
    db.notification.deleteMany({ where: {} });
    // Reset mock authenticated user
    setMockAuthenticatedUser(null);
  });

  describe('get notifications', () => {
    test('should get notifications list', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const fromUserId = new mongoose.Types.ObjectId().toString();
      setMockAuthenticatedUser(userId);

      db.notification.create({
        user: userId,
        fromUser: fromUserId,
        type: NOTIFICATION_TYPES.FRIEND_REQUEST,
        isRead: false,
      });

      const notifications = await getNotifications();
      expect(notifications).toBeDefined();
      expect(notifications).toHaveLength(1);
      expect(notifications[0]!.type).toBe(NOTIFICATION_TYPES.FRIEND_REQUEST);
      expect(notifications[0]!.isRead).toBe(false);
      expect(notifications[0]!.user).toBeDefined();
      expect(notifications[0]!.fromUser).toBeDefined();
      expect(notifications[0]!.createdAt).toBeInstanceOf(Date);
      expect(notifications[0]!.updatedAt).toBeInstanceOf(Date);
    });

    test('should only get notifications for authenticated user', async () => {
      const user1Id = new mongoose.Types.ObjectId().toString();
      const user2Id = new mongoose.Types.ObjectId().toString();
      const fromUserId = new mongoose.Types.ObjectId().toString();

      // Set user1 as the authenticated user
      setMockAuthenticatedUser(user1Id);

      // Create notifications for user 1
      db.notification.create({
        user: user1Id,
        fromUser: fromUserId,
        type: NOTIFICATION_TYPES.FRIEND_REQUEST,
        isRead: false,
      });

      db.notification.create({
        user: user1Id,
        fromUser: fromUserId,
        type: NOTIFICATION_TYPES.ADDED_TO_EXPENSE,
        isRead: true,
      });

      // Create notifications for user 2
      db.notification.create({
        user: user2Id,
        fromUser: fromUserId,
        type: NOTIFICATION_TYPES.FRIEND_REQUEST,
        isRead: false,
      });

      const notifications = await getNotifications();

      // Should only get user 1's notifications
      expect(notifications).toHaveLength(2);
      expect(notifications.every(notification =>
        notification.user === user1Id,
      )).toBe(true);

      // Should not include user 2's notifications
      expect(notifications.some(notification => notification.user === user2Id)).toBe(false);
    });

    test('should return 401 when user is not authenticated', async () => {
      // Don't set any authenticated user
      setMockAuthenticatedUser(null);

      // Create some notifications in the database
      db.notification.create({
        user: new mongoose.Types.ObjectId().toString(),
        fromUser: new mongoose.Types.ObjectId().toString(),
        type: NOTIFICATION_TYPES.FRIEND_REQUEST,
        isRead: false,
      });

      // Should throw error when not authenticated (401 Unauthorized)
      await expect(getNotifications()).rejects.toThrow();
    });

    test('should return empty array when no notifications', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      setMockAuthenticatedUser(userId);

      const notifications = await getNotifications();
      expect(notifications).toEqual([]);
    });
  });

  describe('mark notification as read', () => {
    test('should mark notification as read successfully', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const fromUserId = new mongoose.Types.ObjectId().toString();
      setMockAuthenticatedUser(userId);

      const created = db.notification.create({
        user: userId,
        fromUser: fromUserId,
        type: NOTIFICATION_TYPES.FRIEND_REQUEST,
        isRead: false,
      });

      const updated = await markNotificationAsRead(created.id);
      expect(updated).toBeDefined();
      expect(updated.isRead).toBe(true);
      expect(updated.type).toBe(NOTIFICATION_TYPES.FRIEND_REQUEST);
    });

    test('should not mark notification as read if it belongs to another user', async () => {
      const user1Id = new mongoose.Types.ObjectId().toString();
      const user2Id = new mongoose.Types.ObjectId().toString();
      const fromUserId = new mongoose.Types.ObjectId().toString();

      setMockAuthenticatedUser(user1Id);

      // Create notification for user 2
      const otherUserNotification = db.notification.create({
        user: user2Id,
        fromUser: fromUserId,
        type: NOTIFICATION_TYPES.FRIEND_REQUEST,
        isRead: false,
      });

      await expect(
        markNotificationAsRead(otherUserNotification.id),
      ).rejects.toThrow();
    });

    test('should handle mark notification as read error (404 not found)', async ({ worker }) => {
      const userId = new mongoose.Types.ObjectId().toString();
      setMockAuthenticatedUser(userId);

      simulateError(worker, HTTP_VERB.PATCH, '/api/notifications/nonexistent-notification', 404);

      await expect(
        markNotificationAsRead('nonexistent-notification'),
      ).rejects.toThrow();
    });
  });

  describe('mark all notifications as read', () => {
    test('should mark all notifications as read successfully', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const fromUserId = new mongoose.Types.ObjectId().toString();
      setMockAuthenticatedUser(userId);

      // Create multiple notifications for the authenticated user
      db.notification.create({
        user: userId,
        fromUser: fromUserId,
        type: NOTIFICATION_TYPES.FRIEND_REQUEST,
        isRead: false,
      });

      db.notification.create({
        user: userId,
        fromUser: fromUserId,
        type: NOTIFICATION_TYPES.ADDED_TO_EXPENSE,
        isRead: false,
      });

      // Create notification for another user (should not be affected)
      db.notification.create({
        user: new mongoose.Types.ObjectId().toString(),
        fromUser: fromUserId,
        type: NOTIFICATION_TYPES.FRIEND_REQUEST,
        isRead: false,
      });

      await expect(markAllNotificationsAsRead()).resolves.not.toThrow();

      // Verify only the authenticated user's notifications were marked as read
      const userNotifications = db.notification.findMany({
        where: { user: { equals: userId } },
      });

      expect(userNotifications.every(n => n.isRead)).toBe(true);
    });

    test('should only mark notifications as read for authenticated user', async () => {
      const user1Id = new mongoose.Types.ObjectId().toString();
      const user2Id = new mongoose.Types.ObjectId().toString();
      const fromUserId = new mongoose.Types.ObjectId().toString();

      setMockAuthenticatedUser(user1Id);

      // Create notifications for user 1
      db.notification.create({
        user: user1Id,
        fromUser: fromUserId,
        type: NOTIFICATION_TYPES.FRIEND_REQUEST,
        isRead: false,
      });

      // Create notifications for user 2 (should not be affected)
      db.notification.create({
        user: user2Id,
        fromUser: fromUserId,
        type: NOTIFICATION_TYPES.FRIEND_REQUEST,
        isRead: false,
      });

      await expect(markAllNotificationsAsRead()).resolves.not.toThrow();

      // Verify user 1's notifications were marked as read
      const user1Notifications = db.notification.findMany({
        where: { user: { equals: user1Id } },
      });
      expect(user1Notifications.every(n => n.isRead)).toBe(true);

      // Verify user 2's notifications were NOT marked as read
      const user2Notifications = db.notification.findMany({
        where: { user: { equals: user2Id } },
      });
      expect(user2Notifications.every(n => !n.isRead)).toBe(true);
    });

    test('should handle mark all notifications as read error', async ({ worker }) => {
      const userId = new mongoose.Types.ObjectId().toString();
      setMockAuthenticatedUser(userId);

      simulateError(worker, HTTP_VERB.PATCH, '/api/notifications/mark-all-read', 500);

      await expect(markAllNotificationsAsRead()).rejects.toThrow();
    });
  });

  test('should handle API errors', async ({ worker }) => {
    const userId = new mongoose.Types.ObjectId().toString();
    setMockAuthenticatedUser(userId);

    simulateError(worker, HTTP_VERB.GET, '/api/notifications', 500);

    await expect(getNotifications()).rejects.toThrow();
  });
});
