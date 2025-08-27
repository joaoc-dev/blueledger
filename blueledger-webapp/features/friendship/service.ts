import type { FriendshipDisplay } from './schemas';
import type { CreateNotificationData } from '@/features/notifications/schemas';
import mongoose from 'mongoose';
import Notification from '@/features/notifications/models';
import { NOTIFICATION_TYPES } from '../notifications/constants';
import { FRIENDSHIP_STATUS } from './constants';

import Friendship from './models';

export async function sendFriendRequestWithNotification(
  existingFriendship: FriendshipDisplay | null,
  requesterId: string,
  recipientId: string,
): Promise<string> {
  const session = await mongoose.startSession();

  try {
    return await session.withTransaction(async () => {
      let friendshipId: string;

      if (existingFriendship) {
        // Update the friendship status
        await Friendship.updateOne(
          { _id: existingFriendship.id },
          { $set: { status: FRIENDSHIP_STATUS.PENDING } },
          { session, runValidators: true },
        );

        friendshipId = existingFriendship.id;
      }
      else {
        // Create the friendship request
        const createdFriendships = await Friendship.create([{
          requester: requesterId,
          recipient: recipientId,
          status: 'pending',
        }], { session });

        friendshipId = (createdFriendships[0]!._id as mongoose.Types.ObjectId).toString();
      }

      // Create the notification
      const notificationData: CreateNotificationData = {
        fromUser: requesterId,
        type: NOTIFICATION_TYPES.FRIEND_REQUEST,
        isRead: false,
        user: recipientId,
      };
      await Notification.create([notificationData], { session });

      return friendshipId;
    });
  }
  finally {
    await session.endSession();
  }
}
