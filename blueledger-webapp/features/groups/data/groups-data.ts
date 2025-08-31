import type { GroupDisplay, PatchGroupData } from '../schemas';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db/mongoose-client';
import { GROUP_STATUS } from '../constants';
import { mapGroupModelToDisplay } from '../mapper-server';
import Group from '../models';

/**
 * Retrieves a single group by its ID.
 *
 * @param id - The MongoDB ObjectId of the group as a string
 * @returns Promise<GroupDisplay | null> - The group display data or null if not found/invalid
 *
 * @remarks
 * - Only returns groups with ACTIVE status
 * - Returns null for invalid ObjectId strings
 */
export async function getGroupById(id: string): Promise<GroupDisplay | null> {
  if (!mongoose.Types.ObjectId.isValid(id))
    return null;

  await dbConnect();

  const group = await Group.findOne({
    _id: id,
    status: GROUP_STATUS.ACTIVE,
  }).lean();

  return group ? mapGroupModelToDisplay(group) : null;
}

/**
 * Updates an existing group with the provided data.
 *
 * @param params - Object containing id and data to update
 * @param params.id - The MongoDB ObjectId of the group to update
 * @param params.data - The partial group data to update
 * @returns Promise<GroupDisplay | null> - The updated group display data or null if not found/invalid
 *
 * @remarks
 * - Only updates groups with ACTIVE status
 * - Returns null for invalid ObjectId strings
 * - Uses findOneAndUpdate with { new: true } to return the updated document
 */
export async function updateGroup(params: PatchGroupData): Promise<GroupDisplay | null> {
  if (!mongoose.Types.ObjectId.isValid(params.id))
    return null;

  await dbConnect();

  const updated = await Group.findOneAndUpdate(
    { _id: params.id, status: GROUP_STATUS.ACTIVE },
    params.data,
    { new: true },
  );

  return updated ? mapGroupModelToDisplay(updated) : null;
}

/**
 * Soft deletes a group by marking it as inactive and setting a deletion timestamp.
 *
 * @param id - The id of the group to delete
 * @returns Promise<GroupDisplay | null> - The deleted group display data or null if not found/invalid
 *
 * @remarks
 * - Performs a soft delete (sets status to INACTIVE and adds deletedAt timestamp)
 * - Only deletes groups with ACTIVE status
 * - Returns null for invalid ObjectId strings
 * - The group data is preserved in the database but marked as inactive
 */
export async function deleteGroup(id: string): Promise<GroupDisplay | null> {
  if (!mongoose.Types.ObjectId.isValid(id))
    return null;

  await dbConnect();

  const res = await Group.findOneAndUpdate(
    { _id: id, status: GROUP_STATUS.ACTIVE },
    { status: GROUP_STATUS.INACTIVE, deletedAt: new Date() },
    { new: true },
  );

  return res ? mapGroupModelToDisplay(res) : null;
}
