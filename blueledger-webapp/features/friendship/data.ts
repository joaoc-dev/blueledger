import type { FriendshipStatus } from './constants';
import type { CreateFriendshipData, FriendshipDisplay, UpdateFriendshipData } from './schemas';
import { FRIENDSHIP_STATUS } from './constants';
import { mapModelToDisplay } from './mapper-server';
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

export async function getFriendshipsForUser(userId: string): Promise<FriendshipDisplay[]> {
  const friendships = await Friendship.find({
    $or: [
      { requester: userId },
      { recipient: userId },
    ],
  })
    .populate({ path: 'requester', select: 'name email image' })
    .populate({ path: 'recipient', select: 'name email image' })
    .lean();

  return friendships.map(mapModelToDisplay);
}

export async function createFriendship(friendship: CreateFriendshipData): Promise<FriendshipDisplay> {
  const createdFriendship = await Friendship.create(friendship);
  return mapModelToDisplay(createdFriendship);
}

export async function updateFriendship(friendship: UpdateFriendshipData): Promise<FriendshipDisplay | null> {
  const updatedFriendship = await Friendship.findByIdAndUpdate(friendship.id, friendship, { new: true });
  return updatedFriendship ? mapModelToDisplay(updatedFriendship) : null;
}

export async function deleteFriendship(id: string): Promise<FriendshipDisplay | null> {
  const deletedFriendship = await Friendship.findByIdAndDelete(id);
  return deletedFriendship ? mapModelToDisplay(deletedFriendship) : null;
}
