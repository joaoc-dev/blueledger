import { NotificationType } from '@/types/notification';
import Notification, {
  NotificationDocument,
} from '@/models/notification.model';
import dbConnect from '@/lib/db/mongoose-client';

function toNotificationType(
  notification: NotificationDocument
): NotificationType {
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
  notification: Partial<NotificationType>
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
  notification: Partial<NotificationType>
): Promise<NotificationType> {
  await dbConnect();

  const notificationModel = toNotificationModel(notification);

  const newNotification = await Notification.create(notificationModel);

  return toNotificationType(newNotification);
}

export async function getNotifications(): Promise<NotificationType[]> {
  await dbConnect();

  const notifications = await Notification.find()
    .populate({ path: 'fromUser', select: 'name image' })
    .populate({ path: 'user', select: 'name image' })
    .lean();

  return notifications.map(toNotificationType);
}

export async function getNotificationById(
  id: string
): Promise<NotificationType | null> {
  await dbConnect();

  const notification = await Notification.findById(id)
    .populate({ path: 'fromUser', select: 'name image' })
    .populate({ path: 'user', select: 'name image' })
    .lean();

  return notification ? toNotificationType(notification) : null;
}

export async function updateNotification(
  notification: Partial<NotificationType>
): Promise<NotificationType | null> {
  await dbConnect();

  const existing = await Notification.findById(notification.id);
  if (!existing) return null;

  const { user, fromUser, ...rest } = notification;
  const updateData = {
    ...rest,
    ...(user?.id && { user: user.id }),
    ...(fromUser?.id && { fromUser: fromUser.id }),
  };

  const updatedNotification = await Notification.findByIdAndUpdate(
    notification.id,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  )
    .populate({ path: 'fromUser', select: 'name image' })
    .populate({ path: 'user', select: 'name image' })
    .lean();

  return updatedNotification ? toNotificationType(updatedNotification) : null;
}
