import { Types } from 'mongoose';
import { z } from 'zod';
import { FRIENDSHIP_STATUS_VALUES } from './constants';

const idSchema = z
  .string()
  .refine(Types.ObjectId.isValid, { message: 'Invalid ID' });

export const sendFriendRequestSchema = z.object({
  email: z.string().email(),
});

export type SendFriendRequestData = z.infer<typeof sendFriendRequestSchema>;

export const friendshipStatusSchema = z.enum(FRIENDSHIP_STATUS_VALUES);

export const createFriendshipSchema = z.object({
  data: z.object({
    requester: idSchema,
    recipient: idSchema,
    status: friendshipStatusSchema,
  }),
});

export type CreateFriendshipData = z.infer<typeof createFriendshipSchema>;

export const updateFriendshipSchema = z.object({
  id: idSchema,
  data: z.object({
    status: friendshipStatusSchema.optional(),
  }),
});

export type UpdateFriendshipData = z.infer<typeof updateFriendshipSchema>;

export const deleteFriendshipSchema = z.object({
  id: idSchema,
});

export type DeleteFriendshipData = z.infer<typeof deleteFriendshipSchema>;

export const friendshipDisplaySchema = z.object({
  id: idSchema,
  requesterName: z.string().optional(),
  requesterEmail: z.string().email().optional(),
  requesterImage: z.string().optional(),
  recipientName: z.string().optional(),
  recipientEmail: z.string().email().optional(),
  recipientImage: z.string().optional(),
  status: friendshipStatusSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  acceptedAt: z.date().nullable().optional(),
});

export type FriendshipDisplay = z.infer<typeof friendshipDisplaySchema>;

export const friendshipApiResponseSchema = friendshipDisplaySchema.extend({
  createdAt: z.string(),
  updatedAt: z.string(),
  acceptedAt: z.string().nullable().optional(),
});

export type FriendshipApiResponse = z.infer<typeof friendshipApiResponseSchema>;

export const friendshipListApiResponseSchema = z.object({
  current: friendshipApiResponseSchema,
  pending: friendshipApiResponseSchema,
});

export type FriendshipListApiResponse = z.infer<typeof friendshipListApiResponseSchema>;
