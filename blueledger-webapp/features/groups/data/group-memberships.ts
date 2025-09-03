import type { GroupMembershipStatus } from '../constants';
import type { GroupMembershipDisplay, UpdateGroupMembershipData } from '../schemas';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db/mongoose-client';
import { GROUP_MEMBERSHIP_STATUS, GROUP_ROLES, GROUP_STATUS } from '../constants';

import { mapGroupMembershipToDisplay } from '../mapper-server';
import { GroupMembership } from '../models';

/**
 * Standard population configuration for group memberships
 */
function getMembershipPopulationConfig() {
  return [
    {
      path: 'group',
      select: '_id name image owner status',
      match: { status: GROUP_STATUS.ACTIVE },
      populate: {
        path: 'owner',
        select: 'name email image',
      },
    },
    {
      path: 'user',
      select: 'name email image',
    },
    {
      path: 'invitedBy',
      select: 'name email image',
    },
  ];
}

/**
 * Calculate member counts for given group IDs
 */
async function calculateMemberCountsForGroups(groupIds: string[]): Promise<Record<string, number>> {
  if (groupIds.length === 0)
    return {};

  const counts = await GroupMembership.aggregate([
    {
      $match: {
        group: { $in: groupIds.map(id => new mongoose.Types.ObjectId(id)) },
        status: GROUP_MEMBERSHIP_STATUS.ACCEPTED,
      },
    },
    {
      $group: {
        _id: '$group',
        count: { $sum: 1 },
      },
    },
  ]);

  return counts.reduce((acc, c) => {
    acc[c._id.toString()] = c.count;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Calculate member count for a single group
 */
async function calculateMemberCountForGroup(groupId: string): Promise<number> {
  const [countResult] = await GroupMembership.aggregate([
    {
      $match: {
        group: new mongoose.Types.ObjectId(groupId),
        status: GROUP_MEMBERSHIP_STATUS.ACCEPTED,
      },
    },
    {
      $group: {
        _id: '$group',
        count: { $sum: 1 },
      },
    },
  ]);

  return countResult ? countResult.count : 0;
}

/**
 * Apply member counts to populated memberships and map to display format
 */
function mapMembershipsWithMemberCounts(
  memberships: any[],
  memberCounts: Record<string, number>,
): GroupMembershipDisplay[] {
  return memberships.map(membership => mapGroupMembershipToDisplay({
    ...membership,
    group: {
      ...(membership.group as any),
      memberCount: memberCounts[(membership.group as any)._id.toString()] ?? 0,
      memberSince: membership.acceptedAt ?? undefined,
    },
  }));
}

/**
 * Apply member count to single populated membership and map to display format
 */
function mapMembershipWithMemberCount(
  membership: any,
  memberCount: number,
): GroupMembershipDisplay {
  return mapGroupMembershipToDisplay({
    ...membership,
    group: {
      ...(membership.group as any),
      memberCount,
      memberSince: membership.acceptedAt ?? undefined,
    },
  });
}

/**
 * Retrieves all group memberships for a specific user.
 *
 * This function fetches pending and accepted memberships for active groups only,
 * including fully populated group, user, and invitedBy details with member counts.
 *
 * @param userId - The MongoDB ObjectId of the user as a string
 * @returns Promise<GroupMembershipDisplay[]> - Array of membership display objects,
 *          empty array if userId is invalid or no memberships found
 */
export async function getMembershipsForUser(userId: string): Promise<GroupMembershipDisplay[]> {
  if (!mongoose.Types.ObjectId.isValid(userId))
    return [];

  await dbConnect();

  const membershipStatuses = [
    GROUP_MEMBERSHIP_STATUS.PENDING,
    GROUP_MEMBERSHIP_STATUS.ACCEPTED,
  ];

  // Fetch memberships with full population
  const memberships = await GroupMembership.find({
    user: userId,
    status: { $in: membershipStatuses },
  })
    .populate(getMembershipPopulationConfig())
    .lean();

  // Filter out memberships where group is null (inactive groups)
  const activeMemberships = memberships.filter(m => m.group !== null);

  // Collect group IDs for member count calculation
  const groupIds = activeMemberships.map(m => (m.group as any)._id.toString());

  // Calculate member counts for all groups
  const memberCounts = await calculateMemberCountsForGroups(groupIds);

  // Map to display format with member counts
  return mapMembershipsWithMemberCounts(activeMemberships, memberCounts);
}
/**
 * Retrieves a group membership for a specific user and group, regardless of membership status.
 *
 * This function fetches the membership with full population of related data (group, user, invitedBy)
 * and includes member count for the group. Returns null if membership not found or group is inactive.
 *
 * @param groupId - The MongoDB ObjectId of the group as a string
 * @param userId - The MongoDB ObjectId of the user as a string
 * @returns Promise<GroupMembershipDisplay | null> - The membership display object or null
 */
export async function getGroupMembershipByGroupIdAndUserId(
  groupId: string,
  userId: string,
): Promise<GroupMembershipDisplay | null> {
  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(groupId))
    return null;

  await dbConnect();

  // Fetch membership with full population
  const membership = await GroupMembership.findOne({
    group: groupId,
    user: userId,
  })
    .populate(getMembershipPopulationConfig())
    .lean();

  // Return null if membership not found or group is inactive
  if (!membership || !membership.group) {
    return null;
  }

  // Calculate member count for the group
  const memberCount = await calculateMemberCountForGroup(groupId);

  // Map to display format with member count
  return mapMembershipWithMemberCount(membership, memberCount);
}

/**
 * Retrieves a group membership by its ID with full details and member count.
 *
 * This function fetches the membership with complete population of related entities
 * (group, user, invitedBy) and calculates the current member count for the group.
 * Returns null if membership not found or group is inactive.
 *
 * @param membershipId - The MongoDB ObjectId of the membership as a string
 * @returns Promise<GroupMembershipDisplay | null> - The membership display object or null
 */
export async function getGroupMembershipWithDetails(
  membershipId: string,
): Promise<GroupMembershipDisplay | null> {
  if (!mongoose.Types.ObjectId.isValid(membershipId))
    return null;

  await dbConnect();

  // Fetch the membership with full population
  const membership = await GroupMembership.findById(membershipId)
    .populate(getMembershipPopulationConfig())
    .lean();

  // Return null if membership not found or group is inactive
  if (!membership || !membership.group) {
    return null;
  }

  const groupId = (membership.group as any)._id.toString();

  // Calculate member count for the group
  const memberCount = await calculateMemberCountForGroup(groupId);

  // Map to display format with member count
  return mapMembershipWithMemberCount(membership, memberCount);
}

/**
 * Retrieves all memberships for a specific group with full details and member count.
 *
 * This function fetches all pending and accepted memberships for the group, including
 * complete population of related entities (group, user, invitedBy) and the current
 * member count for the group. Only returns memberships for active groups.
 *
 * @param groupId - The MongoDB ObjectId of the group as a string
 * @returns Promise<GroupMembershipDisplay[]> - Array of membership display objects
 */
export async function getAllGroupMembershipsWithDetails(groupId: string): Promise<GroupMembershipDisplay[]> {
  if (!mongoose.Types.ObjectId.isValid(groupId))
    return [];

  await dbConnect();

  // 1. fetch all memberships for the group (pending and accepted)
  const membershipStatuses = [
    GROUP_MEMBERSHIP_STATUS.PENDING,
    GROUP_MEMBERSHIP_STATUS.ACCEPTED,
  ];

  const memberships = await GroupMembership.find({
    group: groupId,
    status: { $in: membershipStatuses },
  })
    .populate({
      path: 'group',
      select: '_id name image owner status',
      match: { status: GROUP_STATUS.ACTIVE },
      populate: {
        path: 'owner',
        select: 'name email image',
      },
    })
    .populate({
      path: 'user',
      select: 'name email image',
    })
    .populate({
      path: 'invitedBy',
      select: 'name email image',
    })
    .lean();

  // Filter out memberships where group is null (inactive groups)
  const activeMemberships = memberships.filter(m => m.group !== null);

  // 2: get member count for the group
  const memberCount = await GroupMembership.countDocuments({
    group: groupId,
    status: GROUP_MEMBERSHIP_STATUS.ACCEPTED,
  });

  // 3: map memberships to display
  return activeMemberships.map(membership => mapGroupMembershipToDisplay({
    ...membership,
    group: {
      ...(membership.group as any),
      memberCount,
      memberSince: membership.acceptedAt ?? undefined,
    },
  }));
}

/**
 * Retrieves all user IDs for members of a specific group.
 *
 * This function fetches all pending and accepted memberships for the group and returns
 * an array of user IDs (as strings) for all members. Used for membership validation
 * and access control checks.
 *
 * @param groupId - The MongoDB ObjectId of the group as a string
 * @returns Promise<string[]> - Array of user IDs as strings
 */
export async function getAllGroupMembershipsUserIds(groupId: string): Promise<string[]> {
  if (!mongoose.Types.ObjectId.isValid(groupId))
    return [];

  await dbConnect();

  // 1. fetch all memberships for the group (pending and accepted)
  const membershipStatuses = [
    GROUP_MEMBERSHIP_STATUS.PENDING,
    GROUP_MEMBERSHIP_STATUS.ACCEPTED,
  ];

  const memberships = await GroupMembership.find({
    group: groupId,
    status: { $in: membershipStatuses },
  }).select('user');

  return memberships.map(m => m.user.toString());
}

/**
 * Internal function to update a group membership and return the updated display object.
 *
 * @private
 * @param membership - The membership update data containing ID and update fields
 * @returns Promise<GroupMembershipDisplay | null> - The updated membership display object or null
 */
async function updateGroupMembership(
  membership: UpdateGroupMembershipData,
): Promise<GroupMembershipDisplay | null> {
  await dbConnect();

  const updatedMembership = await GroupMembership.findByIdAndUpdate(
    membership.id,
    membership.data,
    { new: true },
  );

  return updatedMembership ? mapGroupMembershipToDisplay(updatedMembership) : null;
}

/**
 * Updates the status of a group membership.
 *
 * This function updates the membership status and optionally sets the accepted timestamp.
 * Used for accepting/declining group invitations or updating membership state.
 *
 * @param params - The update parameters
 * @param params.membershipId - The MongoDB ObjectId of the membership as a string
 * @param params.status - The new membership status
 * @param params.acceptedAt - Optional timestamp when the membership was accepted
 * @returns Promise<GroupMembershipDisplay | null> - The updated membership display object or null
 */
export async function updateGroupMembershipStatus(params: {
  membershipId: string;
  status: GroupMembershipStatus;
  acceptedAt?: Date;
}): Promise<any | null> {
  if (!mongoose.Types.ObjectId.isValid(params.membershipId))
    return null;

  const updateData: UpdateGroupMembershipData = {
    id: params.membershipId,
    data: {
      status: params.status,
      ...(params.acceptedAt && { acceptedAt: params.acceptedAt }),
    },
  };

  return await updateGroupMembership(updateData);
}

/**
 * Checks if a user is the owner of a specific group.
 *
 * This function verifies if the user has the OWNER role in the group membership.
 * Returns false if the membership doesn't exist or the user is not the owner.
 *
 * @param groupId - The MongoDB ObjectId of the group as a string
 * @param userId - The MongoDB ObjectId of the user as a string
 * @returns Promise<boolean> - True if the user is the group owner, false otherwise
 */
export async function isGroupOwner(groupId: string, userId: string): Promise<boolean> {
  if (!mongoose.Types.ObjectId.isValid(groupId) || !mongoose.Types.ObjectId.isValid(userId))
    return false;

  await dbConnect();

  const membership = await GroupMembership.findOne({
    group: groupId,
    user: userId,
  }).lean();

  return membership ? membership.role === GROUP_ROLES.OWNER : false;
}

/**
 * Checks if a user is either a member or owner of a specific group.
 *
 * This function verifies if the user has either MEMBER or OWNER role in the group membership.
 * Returns false if the membership doesn't exist or the user doesn't have the required role.
 *
 * @param groupId - The MongoDB ObjectId of the group as a string
 * @param userId - The MongoDB ObjectId of the user as a string
 * @returns Promise<boolean> - True if the user is a member or owner, false otherwise
 */
export async function isGroupMemberOrOwner(groupId: string, userId: string): Promise<boolean> {
  if (!mongoose.Types.ObjectId.isValid(groupId) || !mongoose.Types.ObjectId.isValid(userId))
    return false;

  await dbConnect();

  const membership = await GroupMembership.findOne({ group: groupId, user: userId }).lean();

  return membership
    ? membership.role === GROUP_ROLES.MEMBER || membership.role === GROUP_ROLES.OWNER
    : false;
}

/**
 * Checks if a user is the recipient of a specific group membership.
 *
 * This function verifies if the provided user ID matches the user associated with the membership.
 * Used for authorization checks to ensure users can only access their own membership data.
 *
 * @param membershipId - The MongoDB ObjectId of the membership as a string
 * @param userId - The MongoDB ObjectId of the user as a string
 * @returns Promise<boolean> - True if the user is the membership recipient, false otherwise
 */
export async function isGroupMembershipRecipient(membershipId: string, userId: string): Promise<boolean> {
  if (!mongoose.Types.ObjectId.isValid(membershipId) || !mongoose.Types.ObjectId.isValid(userId))
    return false;

  await dbConnect();

  const membership = await GroupMembership.findById(membershipId)
    .populate({ path: 'user', select: '_id' });

  return membership ? (membership.user as any)._id.toString() === userId : false;
}
