import { Types } from 'mongoose';
import { z } from 'zod';

const isReadSchema = z.boolean();

export const patchNotificationSchema = z.object({
  params: z.object({
    id: z.string().refine(Types.ObjectId.isValid, { message: 'Invalid ID' }),
  }),
  body: z.object({
    isRead: isReadSchema,
  }),
});
