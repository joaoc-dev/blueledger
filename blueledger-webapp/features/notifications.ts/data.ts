import {
  NotificationDisplay,
  PatchNotificationData,
  CreateNotificationData,
} from '@/features/notifications.ts/schemas';
import Notification from '@/features/notifications.ts/model';
import dbConnect from '@/lib/db/mongoose-client';
import { mapModelToDisplay } from './mapper-server';
import { ExpenseDocument } from '../expenses/model';

export async function createNotification(
  notification: CreateNotificationData
): Promise<NotificationDisplay> {
  await dbConnect();

  const notificationModel: Partial<ExpenseDocument> = {
    ...notification,
  };

  const newNotification = await Notification.create(notificationModel);

  return mapModelToDisplay(newNotification);
}

export async function getNotifications(): Promise<NotificationDisplay[]> {
  await dbConnect();

  const notifications = await Notification.find()
    .populate({ path: 'fromUser', select: 'name image' })
    .populate({ path: 'user', select: 'name image' })
    .lean();

  return notifications.map(mapModelToDisplay);
}

export async function getNotificationById(
  id: string
): Promise<NotificationDisplay | null> {
  await dbConnect();

  const notification = await Notification.findById(id)
    .populate({ path: 'fromUser', select: 'name image' })
    .populate({ path: 'user', select: 'name image' })
    .lean();

  return notification ? mapModelToDisplay(notification) : null;
}

export async function updateNotification(
  notification: PatchNotificationData
): Promise<NotificationDisplay | null> {
  await dbConnect();

  const existing = await Notification.findById(notification.params.id);
  if (!existing) return null;

  const updatedData = {
    ...existing.toObject(),
    ...notification.body,
  };

  const updatedNotification = await Notification.findByIdAndUpdate(
    notification.params.id,
    updatedData,
    {
      new: true,
      runValidators: true,
    }
  )
    .populate({ path: 'fromUser', select: 'name image' })
    .populate({ path: 'user', select: 'name image' })
    .lean();

  return updatedNotification ? mapModelToDisplay(updatedNotification) : null;
}

export async function markAllNotificationsAsRead(
  userId: string
): Promise<void> {
  await dbConnect();

  await Notification.updateMany(
    { user: userId, isRead: false },
    { isRead: true }
  );
}
