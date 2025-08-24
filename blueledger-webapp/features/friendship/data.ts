import type { FriendshipStatus } from './constants';
import { FRIENDSHIP_STATUS } from './constants';
import Friendship from './model';

export async function getFriendshipStatus(userId: string, friendUserId: string): Promise<FriendshipStatus> {
  const friendship = await Friendship.findOne({
    $or: [
      { requester: userId, recipient: friendUserId },
      { requester: friendUserId, recipient: userId },
    ],
  });

  return friendship?.status ?? FRIENDSHIP_STATUS.NONE;
}
