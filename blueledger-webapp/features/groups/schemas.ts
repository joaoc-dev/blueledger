import { Types } from 'mongoose';
import { z } from 'zod';
import {
  GROUP_MEMBERSHIP_STATUS_VALUES,
  GROUP_ROLES_VALUES,
  GROUP_STATUS_VALUES,
} from './constants';

const idSchema = z.string().refine(Types.ObjectId.isValid, { message: 'Invalid ID' });

const nameSchema = z
  .string()
  .trim()
  .min(1, { message: 'Name is required' })
  .max(50, { message: 'Name must be less than 50 characters' });

const imageSchema = z.string().optional();

const groupStatusSchema = z.enum(GROUP_STATUS_VALUES);

const groupBaseSchema = {
  name: nameSchema,
  image: imageSchema,
};

const groupMembershipStatusSchema = z.enum(GROUP_MEMBERSHIP_STATUS_VALUES);

const groupRoleSchema = z.enum(GROUP_ROLES_VALUES);

const createGroupSchema = z.object({
  ...groupBaseSchema,
  owner: idSchema,
  status: groupStatusSchema,
});

export const patchGroupSchema = z.object({
  id: idSchema,
  data: z.object({
    ...groupBaseSchema,
    status: groupStatusSchema.optional(),
  }),
});

export type PatchGroupData = z.infer<typeof patchGroupSchema>;

export const deleteGroupSchema = z.object({
  id: idSchema,
});

const createGroupMembershipSchema = z.object({
  user: idSchema,
  invitedBy: idSchema,
  role: groupRoleSchema,
  status: groupMembershipStatusSchema,
  acceptedAt: z.date().optional(),
});

export const createGroupWithMembershipSchema = z.object({
  group: createGroupSchema,
  membership: createGroupMembershipSchema,
});

export type CreateGroupWithMembershipData = z.infer<typeof createGroupWithMembershipSchema>;

const _updateGroupMembershipSchema = z.object({
  id: idSchema,
  data: z.object({
    status: groupMembershipStatusSchema.optional(),
    acceptedAt: z.date().optional(),
  }),
});

export type UpdateGroupMembershipData = z.infer<typeof _updateGroupMembershipSchema>;

export const groupFormSchema = z.object({
  ...groupBaseSchema,
});

export type GroupFormData = z.infer<typeof groupFormSchema>;

const _groupDisplaySchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  image: z.string().optional(),
  ownerName: z.string(),
  status: groupStatusSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type GroupDisplay = z.infer<typeof _groupDisplaySchema>;

const groupMembershipDisplaySchema = z.object({
  id: z.string(),
  optimisticId: z.string().optional(),
  group: z.object({
    id: z.string(),
    name: z.string(),
    image: z.string().optional(),
    ownerName: z.string(),
    ownerImage: z.string().optional(),
    memberCount: z.number(),
    memberSince: z.date().nullable().optional(),
  }).required(),
  user: z.object({
    name: z.string(),
    email: z.string().email(),
    image: z.string().optional(),
  }).optional(),
  invitedByName: z.string().optional(),
  role: groupRoleSchema,
  status: groupMembershipStatusSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  acceptedAt: z.date().nullable().optional(),
});

export type GroupMembershipDisplay = z.infer<typeof groupMembershipDisplaySchema>;

export const inviteToGroupByEmailSchema = z.object({
  email: z.string().email(),
});

export const transferOwnershipSchema = z.object({
  toUserMembershipId: idSchema,
});

const _groupMembershipApiResponseSchema = groupMembershipDisplaySchema.extend({
  createdAt: z.string(),
  updatedAt: z.string(),
  acceptedAt: z.string().nullable().optional(),
});

export type GroupMembershipApiResponse = z.infer<typeof _groupMembershipApiResponseSchema>;
