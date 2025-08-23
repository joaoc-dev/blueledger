import { http, HttpResponse } from 'msw';
import { db } from '../db';

// Mock authenticated user ID for testing
// In a real scenario, this would come from the auth context
let mockAuthenticatedUserId: string | null = null;

export function setMockAuthenticatedUser(userId: string | null) {
  mockAuthenticatedUserId = userId;
}

// Note: We intentionally avoid using auto-generated MSW handlers (notificationModel.toHandlers)
// Instead, we define explicit handlers that give us full control over request/response handling.
const getNotificationsHandler = http.get('/api/notifications', () => {
  if (!mockAuthenticatedUserId) {
    // If no authenticated user, return 401 Unauthorized (matching withAuth behavior)
    return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Filter notifications to only return those belonging to the authenticated user
  const userNotifications = db.notification.findMany({
    where: { user: { equals: mockAuthenticatedUserId } },
  });

  // Sort by createdAt desc to mirror server behavior
  const sorted = [...userNotifications].sort(
    (a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  // Project nested user/fromUser without ids (populate-like)
  const present = sorted.map((n: any) => {
    const populatedUser = db.user.findFirst({ where: { id: { equals: n.user } } });
    const populatedFromUser = db.user.findFirst({ where: { id: { equals: n.fromUser } } });
    return {
      ...n,
      user: populatedUser
        ? { name: populatedUser.name, image: populatedUser.image }
        : null,
      fromUser: populatedFromUser
        ? { name: populatedFromUser.name, image: populatedFromUser.image }
        : null,
    };
  });

  return HttpResponse.json(present);
});

const markAllNotificationsAsReadHandler = http.patch('/api/notifications/mark-all-read', () => {
  if (!mockAuthenticatedUserId) {
    return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only mark notifications as read for the authenticated user
  const userNotifications = db.notification.findMany({
    where: { user: { equals: mockAuthenticatedUserId } },
  });

  userNotifications.forEach((n: { id: string }) => {
    db.notification.update({ where: { id: { equals: n.id } }, data: { isRead: true } });
  });

  return HttpResponse.json({ success: true });
});

const updateNotificationHandler = http.patch('/api/notifications/:id', ({ params }) => {
  if (!mockAuthenticatedUserId) {
    return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = String(params.id);

  // First check if the notification belongs to the authenticated user
  const notification = db.notification.findFirst({
    where: {
      id: { equals: id },
      user: { equals: mockAuthenticatedUserId },
    },
  });

  if (!notification) {
    return HttpResponse.json({ error: 'Notification not found' }, { status: 404 });
  }

  const updated = db.notification.update({
    where: { id: { equals: id } },
    data: { isRead: true, updatedAt: new Date().toISOString() },
  });

  const populatedUser = db.user.findFirst({ where: { id: { equals: updated?.user } } });
  const populatedFromUser = db.user.findFirst({ where: { id: { equals: updated?.fromUser } } });
  const present = {
    ...updated,
    user: populatedUser
      ? { name: populatedUser.name, image: populatedUser.image }
      : null,
    fromUser: populatedFromUser
      ? { name: populatedFromUser.name, image: populatedFromUser.image }
      : null,
  };

  return HttpResponse.json(present);
});

const customNotificationHandlers = [
  getNotificationsHandler,
  markAllNotificationsAsReadHandler,
  updateNotificationHandler,
];

export const notificationHandlers = customNotificationHandlers;
