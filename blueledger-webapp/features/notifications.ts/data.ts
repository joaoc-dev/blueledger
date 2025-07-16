import {
  NotificationDisplay,
  PatchNotificationData,
} from '@/features/notifications.ts/schemas';
import Notification from '@/features/notifications.ts/model';
import dbConnect from '@/lib/db/mongoose-client';
import { mapDisplayToModel, mapModelToDisplay } from './mapper';

export async function createNotification(
  notification: Partial<NotificationDisplay>
): Promise<NotificationDisplay> {
  await dbConnect();

  const notificationModel = mapDisplayToModel(notification);

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
