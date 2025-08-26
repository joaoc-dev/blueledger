import type { FriendshipStatus } from './constants';
import type { CreateFriendshipData, FriendshipDisplay, UpdateFriendshipData } from './schemas';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db/mongoose-client';
import { FRIENDSHIP_STATUS } from './constants';
import { mapModelToDisplay } from './mapper-server';
import Friendship from './model';

export async function getFriendshipById(
  id: string,
  userId: string,
): Promise<FriendshipDisplay | null> {
  if (!mongoose.Types.ObjectId.isValid(id))
    return null;

  if (!mongoose.Types.ObjectId.isValid(userId))
    return null;

  await dbConnect();

  const friendship = await Friendship.findOne({
    _id: id,
    $or: [{ requester: userId }, { recipient: userId }],
  })
    .populate({ path: 'requester', select: 'name email image' })
    .populate({ path: 'recipient', select: 'name email image' })
    .lean();

  return friendship ? mapModelToDisplay(friendship, userId) : null;
}

export async function getFriendshipByUsers(
  userId: string,
  friendUserId: string,
): Promise<FriendshipDisplay | null> {
  if (!mongoose.Types.ObjectId.isValid(userId))
    return null;

  if (!mongoose.Types.ObjectId.isValid(friendUserId))
    return null;

  await dbConnect();

  const friendship = await Friendship.findOne({
    $or: [
      { requester: userId, recipient: friendUserId },
      { requester: friendUserId, recipient: userId },
    ],
  });

  return friendship ? mapModelToDisplay(friendship, userId) : null;
}

export async function getFriendshipStatus(
  userId: string,
  friendUserId: string,
): Promise<FriendshipStatus> {
  if (!mongoose.Types.ObjectId.isValid(userId))
    return FRIENDSHIP_STATUS.NONE;

  if (!mongoose.Types.ObjectId.isValid(friendUserId))
    return FRIENDSHIP_STATUS.NONE;

  await dbConnect();

  const friendship = await Friendship.findOne({
    $or: [
      { requester: userId, recipient: friendUserId },
      { requester: friendUserId, recipient: userId },
    ],
  });

  return friendship?.status ?? FRIENDSHIP_STATUS.NONE;
}

export async function getFriendshipsForUser(
  userId: string,
): Promise<FriendshipDisplay[]> {
  if (!mongoose.Types.ObjectId.isValid(userId))
    return [];

  await dbConnect();

  const friendships = await Friendship.find({
    $or: [
      { requester: userId },
      { recipient: userId },
    ],
  })
    .populate({ path: 'requester', select: 'name email image' })
    .populate({ path: 'recipient', select: 'name email image' })
    .lean();

  return friendships.map(friendship => mapModelToDisplay(friendship, userId));
}

export async function createFriendship(
  friendship: CreateFriendshipData,
): Promise<FriendshipDisplay> {
  await dbConnect();

  const createdFriendship = await Friendship.create(friendship.data);

  return mapModelToDisplay(createdFriendship);
}

export async function updateFriendship(
  friendship: UpdateFriendshipData,
): Promise<FriendshipDisplay | null> {
  await dbConnect();

  const updatedFriendship = await Friendship.findByIdAndUpdate(
    friendship.id,
    friendship,
    { new: true },
  );

  return updatedFriendship ? mapModelToDisplay(updatedFriendship) : null;
}

export async function deleteFriendship(id: string): Promise<FriendshipDisplay | null> {
  await dbConnect();

  const deletedFriendship = await Friendship.findByIdAndDelete(id);

  return deletedFriendship ? mapModelToDisplay(deletedFriendship) : null;
}

export async function updateFriendshipStatus(
  friendshipId: string,
  status: FriendshipStatus,
  acceptedAt?: Date,
): Promise<FriendshipDisplay | null> {
  await dbConnect();

  const updateData: UpdateFriendshipData = {
    id: friendshipId,
    data: {
      status,
      ...(acceptedAt && { acceptedAt }),
    },
  };

  return await updateFriendship(updateData);
}
