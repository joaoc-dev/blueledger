import {
  NotificationDisplay,
  PatchNotificationData,
} from '@/features/notifications.ts/schemas';
import Notification, {
  NotificationDocument,
} from '@/features/notifications.ts/model';
import dbConnect from '@/lib/db/mongoose-client';

function toNotificationDisplay(
  notification: NotificationDocument
): NotificationDisplay {
  const { _id, ...rest } = notification.toObject
    ? notification.toObject()
    : notification;

  return {
    ...rest,
    id: _id?.toString(),
    user: {
      name: rest.user?.name || '',
      image: rest.user?.image || '',
    },
    fromUser: {
      name: rest.fromUser?.name || '',
      image: rest.fromUser?.image || '',
    },
  };
}

function toNotificationModel(
  notification: Partial<NotificationDisplay>
): NotificationDocument {
  const { user, fromUser, ...rest } = notification;

  const notificationModel = {
    ...rest,
    user: user?.id,
    fromUser: fromUser?.id,
  };

  return new Notification(notificationModel);
}

export async function createNotification(
  notification: Partial<NotificationDisplay>
): Promise<NotificationDisplay> {
  await dbConnect();

  const notificationModel = toNotificationModel(notification);

  const newNotification = await Notification.create(notificationModel);

  return toNotificationDisplay(newNotification);
}

export async function getNotifications(): Promise<NotificationDisplay[]> {
  await dbConnect();

  const notifications = await Notification.find()
    .populate({ path: 'fromUser', select: 'name image' })
    .populate({ path: 'user', select: 'name image' })
    .lean();

  return notifications.map(toNotificationDisplay);
}

export async function getNotificationById(
  id: string
): Promise<NotificationDisplay | null> {
  await dbConnect();

  const notification = await Notification.findById(id)
    .populate({ path: 'fromUser', select: 'name image' })
    .populate({ path: 'user', select: 'name image' })
    .lean();

  return notification ? toNotificationDisplay(notification) : null;
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

  return updatedNotification
    ? toNotificationDisplay(updatedNotification)
    : null;
}
