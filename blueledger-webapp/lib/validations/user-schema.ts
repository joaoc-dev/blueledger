import { Types } from 'mongoose';
import { z } from 'zod';

export const patchUserSchema = z.object({
  params: z.object({
    id: z.string().refine(Types.ObjectId.isValid, { message: 'Invalid ID' }),
  }),
  body: z.object({
    name: z.string().min(1, { message: 'Name is required' }).optional(),
    email: z.string().email({ message: 'Invalid email' }).optional(),
    image: z.string().optional(),
  }),
});
