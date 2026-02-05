import type { FlattenMaps } from 'mongoose';
import type { NotificationDocument } from './models';
import type { NotificationDisplay } from './schemas';

/** Notification as returned by .lean() — plain object, not a full Document. */
type NotificationLean = FlattenMaps<NotificationDocument>
  & Required<{ _id: NotificationDocument['_id'] }> & { __v?: number };

export function mapModelToDisplay(
  notification: NotificationDocument | NotificationLean,
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
