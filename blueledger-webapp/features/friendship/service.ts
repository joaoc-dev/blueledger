import type { FriendshipDocument } from './model';
import type { FriendshipDisplay } from './schemas';
import type { CreateNotificationData } from '@/features/notifications/schemas';
import mongoose from 'mongoose';
import Notification from '@/features/notifications/model';
import { NOTIFICATION_TYPES } from '../notifications/constants';
import { mapModelToDisplay } from './mapper-server';
import Friendship from './model';

export async function sendFriendRequestWithNotification(
  requesterId: string,
  recipientId: string,
): Promise<FriendshipDisplay> {
  const session = await mongoose.startSession();

  try {
    // Check if transactions are supported
    if (!session.supports.causalConsistency) {
      console.warn('Warning: MongoDB transactions may not be supported. Check your MongoDB setup.');
    }

    return await session.withTransaction(async () => {
      // Create the friendship request
      const friendship = await Friendship.create([{
        requester: requesterId,
        recipient: recipientId,
        status: 'pending',
      }], { session });

      // Create the notification
      const notificationData: CreateNotificationData = {
        fromUser: requesterId,
        type: NOTIFICATION_TYPES.FRIEND_REQUEST,
        isRead: false,
        user: recipientId,
      };

      await Notification.create([notificationData], { session });

      // Return the successful result
      return mapModelToDisplay(friendship[0] as FriendshipDocument);
    });
  }
  finally {
    await session.endSession();
  }
}
