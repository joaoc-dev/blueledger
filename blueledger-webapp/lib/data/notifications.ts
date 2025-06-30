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
      name: rest.user.name,
      image: rest.user.image,
    },
    fromUser: {
      name: rest.fromUser.name,
      image: rest.fromUser.image,
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

export async function getNotifications(): Promise<NotificationType[]> {
  await dbConnect();

  const notifications = await Notification.find()
    .populate({ path: 'fromUser', select: 'name image' })
    .lean();

  return notifications.map(toNotificationType);
}

export async function createNotification(
  notification: Partial<NotificationType>
): Promise<NotificationType> {
  await dbConnect();

  const notificationModel = toNotificationModel(notification);

  const newNotification = await Notification.create(notificationModel);

  return toNotificationType(newNotification);
}
