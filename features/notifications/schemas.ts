import { Types } from 'mongoose';
import { z } from 'zod';
import { NOTIFICATION_TYPE_VALUES } from './constants';

const isReadSchema = z.boolean();

export const createNotificationSchema = z.strictObject({
  user: z.string().refine(Types.ObjectId.isValid, { message: 'Invalid ID' }),
  fromUser: z
    .string()
    .refine(Types.ObjectId.isValid, { message: 'Invalid ID' }),
  type: z.enum(NOTIFICATION_TYPE_VALUES),
  isRead: isReadSchema,
});

export type CreateNotificationData = z.infer<typeof createNotificationSchema>;

export const patchNotificationSchema = z.object({
  id: z.string().refine(Types.ObjectId.isValid, { message: 'Invalid ID' }),
  data: z.object({
    isRead: isReadSchema,
  }),
});

export type PatchNotificationData = z.infer<typeof patchNotificationSchema>;

const userDisplaySchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  image: z.string().optional(),
});

export const notificationDisplaySchema = z.object({
  id: z.string().optional(),
  optimisticId: z.string().optional(),
  user: userDisplaySchema,
  fromUser: userDisplaySchema,
  type: z.enum(NOTIFICATION_TYPE_VALUES),
  isRead: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type NotificationDisplay = z.infer<typeof notificationDisplaySchema>;

export const notificationApiResponseSchema = notificationDisplaySchema.extend({
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type NotificationApiResponse = z.infer<
  typeof notificationApiResponseSchema
>;
