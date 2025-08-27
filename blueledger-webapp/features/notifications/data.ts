import type { NotificationDocument } from './models';
import type {
  CreateNotificationData,
  NotificationDisplay,
  PatchNotificationData,
} from './schemas';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db/mongoose-client';
import { mapModelToDisplay } from './mapper-server';
import Notification from './models';

export async function createNotification(
  notification: CreateNotificationData,
): Promise<NotificationDisplay> {
  await dbConnect();

  const notificationModel: Partial<NotificationDocument> = {
    ...notification,
  };

  const newNotification = await Notification.create(notificationModel);

  return mapModelToDisplay(newNotification);
}

export async function getNotifications(userId: string): Promise<NotificationDisplay[]> {
  await dbConnect();

  const notifications = await Notification.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate({ path: 'fromUser', select: 'name image' })
    .populate({ path: 'user', select: 'name image' })
    .lean();

  return notifications.map(mapModelToDisplay);
}

export async function getNotificationById(
  id: string,
): Promise<NotificationDisplay | null> {
  if (!mongoose.Types.ObjectId.isValid(id))
    return null;

  await dbConnect();

  const notification = await Notification.findById(id)
    .populate({ path: 'fromUser', select: 'name image' })
    .populate({ path: 'user', select: 'name image' })
    .lean();

  return notification ? mapModelToDisplay(notification) : null;
}

export async function updateNotification(
  notification: PatchNotificationData,
): Promise<NotificationDisplay | null> {
  await dbConnect();

  const existing = await Notification.findById(notification.id);
  if (!existing)
    return null;

  const updatedData = {
    ...existing.toObject(),
    ...notification.data,
  };

  const updatedNotification = await Notification.findByIdAndUpdate(
    notification.id,
    updatedData,
    {
      new: true,
      runValidators: true,
    },
  )
    .populate({ path: 'fromUser', select: 'name image' })
    .populate({ path: 'user', select: 'name image' })
    .lean();

  return updatedNotification ? mapModelToDisplay(updatedNotification) : null;
}

export async function markAllNotificationsAsRead(
  userId: string,
): Promise<void> {
  await dbConnect();

  await Notification.updateMany(
    { user: userId, isRead: false },
    { isRead: true },
  );
}
