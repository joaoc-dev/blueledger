import Notification, { NotificationDocument } from './model';
import { NotificationDisplay } from './schemas';

export function mapModelToDisplay(
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

// export function mapDisplayToModel(
//   notification: Partial<NotificationDisplay>
// ): NotificationDocument {
//   const { user, fromUser, ...rest } = notification;

//   const notificationModel = {
//     ...rest,
//     user: user?.id,
//     fromUser: fromUser?.id,
//   };

//   return new Notification(notificationModel);
// }
