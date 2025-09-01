import type { CreateGroupWithMembershipData, GroupMembershipDisplay } from './schemas';
import type { CreateNotificationData } from '@/features/notifications/schemas';
import type { UserDisplay } from '@/features/users/schemas';
import mongoose from 'mongoose';
import { FRIENDSHIP_STATUS } from '@/features/friendship/constants';
import { getFriendshipsForUser } from '@/features/friendship/data';
import Notification from '@/features/notifications/models';
import { getUserByEmail } from '@/features/users/data';
import { NOTIFICATION_TYPES } from '../notifications/constants';
import { GROUP_MEMBERSHIP_STATUS, GROUP_ROLES } from './constants';
import { getAllGroupMembershipsUserIds } from './data/group-memberships';
import Group, { GroupMembership } from './models';

/**
 * Sends a group invitation with notification.
 *
 * Creates or updates a group membership to PENDING status and sends a notification
 * to the recipient user. Uses database transactions to ensure data consistency.
 *
 * @param existingMembership - Existing membership if user was previously invited/declined, null for new invites
 * @param inviterId - ID of the user sending the invitation
 * @param recipientUserId - ID of the user receiving the invitation
 * @param groupId - ID of the group to invite the user to
 * @returns Promise<string> - The ID of the created/updated membership
 * @throws Error if database operations fail
 */
export async function sendGroupInviteWithNotification(
  existingMembership: GroupMembershipDisplay | null,
  inviterId: string,
  recipientUserId: string,
  groupId: string,
): Promise<string> {
  const session = await mongoose.startSession();

  try {
    return await session.withTransaction(async () => {
      let membershipId: string;

      if (existingMembership) {
        // Update the membership status
        await GroupMembership.updateOne(
          { _id: existingMembership.id },
          { $set: { status: GROUP_MEMBERSHIP_STATUS.PENDING } },
          { session, runValidators: true },
        );

        membershipId = existingMembership.id!;
      }
      else {
        // Create the membership
        const createdMemberships = await GroupMembership.create([{
          group: groupId,
          user: recipientUserId,
          invitedBy: inviterId,
          role: GROUP_ROLES.MEMBER,
          status: GROUP_MEMBERSHIP_STATUS.PENDING,
        }], { session });

        membershipId = (createdMemberships[0]!._id as mongoose.Types.ObjectId).toString();
      }

      const notificationData: CreateNotificationData = {
        fromUser: inviterId,
        type: NOTIFICATION_TYPES.GROUP_INVITE,
        isRead: false,
        user: recipientUserId,
      };
      await Notification.create([notificationData], { session });

      return membershipId;
    });
  }
  finally {
    await session.endSession();
  }
}

/**
 * Creates a new group and the initial owner membership.
 *
 * Creates both a Group document and a GroupMembership document for the owner
 * in a single database transaction to ensure data consistency.
 *
 * @param params - Object containing group and membership creation data
 * @param params.group - Group creation parameters (name, image, etc.)
 * @param params.membership - Membership creation parameters (user, role, etc.)
 * @returns Promise<{ groupId: string; membershipId: string }> - IDs of created group and membership
 * @throws Error if database operations fail
 */
export async function createGroupAndMembership(
  params: CreateGroupWithMembershipData,
): Promise<{ groupId: string; membershipId: string }> {
  const session = await mongoose.startSession();

  try {
    return await session.withTransaction(async () => {
      const createdGroup = await Group.create([
        { ...params.group },
      ], { session });

      const createdMemberships = await GroupMembership.create([
        { ...params.membership, group: createdGroup[0]!._id, acceptedAt: new Date() },
      ], { session });

      return {
        groupId: (createdGroup[0]!._id as mongoose.Types.ObjectId).toString(),
        membershipId: (createdMemberships[0]!._id as mongoose.Types.ObjectId).toString(),
      };
    });
  }
  finally {
    await session.endSession();
  }
}

/**
 * Gets a list of friends that can be invited to a group.
 *
 * Filters the user's accepted friendships to find friends who are not already
 * members (pending or accepted) of the specified group.
 *
 * @param userId - ID of the user whose friends to check
 * @param groupId - ID of the group to check membership against
 * @returns Promise<UserDisplay[]> - Array of friends who can be invited to the group
 * @throws Error if database queries fail
 */
export async function getInvitableFriends(userId: string, groupId: string): Promise<UserDisplay[]> {
  // Get all accepted friendships for the user
  const friendships = await getFriendshipsForUser(userId);
  const acceptedFriendships = friendships.filter(
    friendship => friendship.status === FRIENDSHIP_STATUS.ACCEPTED,
  );

  const existingMemberIds = await getAllGroupMembershipsUserIds(groupId);
  const existingMemberIdsSet = new Set(existingMemberIds);

  // Filter out friends who already have active/pending membership
  const availableFriends: UserDisplay[] = [];

  for (const friendship of acceptedFriendships) {
    if (!friendship.friend?.email)
      continue;

    // Get the friend user details by email
    const friendDetails = await getUserByEmail(friendship.friend.email);
    if (!friendDetails)
      continue;

    // Check if this friend is already a member
    if (!existingMemberIdsSet.has(friendDetails.id)) {
      availableFriends.push(friendDetails);
    }
  }

  return availableFriends;
}

/**
 * Transfers group ownership from one member to another.
 *
 * Updates the group document to change the owner and updates both membership
 * records to reflect the new roles. Uses database transactions to ensure
 * data consistency across all operations.
 *
 * @param currentOwnerMembershipId - ID of the current owner's membership
 * @param targetOwnerMembershipId - ID of the target user's membership (must be ACCEPTED status)
 * @returns Promise<void>
 * @throws Error if memberships don't exist, don't belong to same group, or database operations fail
 */
export async function transferOwnership(
  currentOwnerMembershipId: string,
  targetOwnerMembershipId: string,
): Promise<void> {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      // Get current owner membership by ID
      const currentOwnerMembership = await GroupMembership
        .findById(currentOwnerMembershipId)
        .session(session);
      if (!currentOwnerMembership) {
        throw new Error('Current owner membership not found');
      }

      // Get target owner membership by ID
      const targetOwnerMembership = await GroupMembership
        .findById(targetOwnerMembershipId)
        .session(session);
      if (!targetOwnerMembership) {
        throw new Error('Target owner membership not found');
      }

      // Verify both memberships belong to the same group
      if (currentOwnerMembership.group.toString() !== targetOwnerMembership.group.toString()) {
        throw new Error('Memberships do not belong to the same group');
      }

      const groupId = currentOwnerMembership.group.toString();
      const newOwnerId = targetOwnerMembership.user.toString();

      // Update group ownership
      await Group.findByIdAndUpdate(
        groupId,
        { owner: newOwnerId },
        { session },
      );

      // Update membership roles
      await GroupMembership.updateOne(
        { _id: currentOwnerMembership._id },
        { role: GROUP_ROLES.MEMBER },
        { session },
      );

      await GroupMembership.updateOne(
        { _id: targetOwnerMembership._id },
        { role: GROUP_ROLES.OWNER },
        { session },
      );
    });
  }
  finally {
    await session.endSession();
  }
}
