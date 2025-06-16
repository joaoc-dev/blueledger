import { Types } from 'mongoose';
import { z } from 'zod';

const nameSchema = z.string().min(1, { message: 'Name is required' });
const emailSchema = z.string().email({ message: 'Invalid email' });
const imageSchema = z.string().optional();
const bioSchema = z.string().optional();

const baseFields = {
  name: nameSchema,
  email: emailSchema,
  bio: bioSchema,
};

export const userProfileFormSchema = z.object({
  ...baseFields,
});

export type UserProfileFormData = z.infer<typeof userProfileFormSchema>;

export const patchUserSchema = z.object({
  params: z.object({
    id: z.string().refine(Types.ObjectId.isValid, { message: 'Invalid ID' }),
  }),
  body: z
    .strictObject({
      name: nameSchema.optional(),
      image: imageSchema.optional(),
      bio: bioSchema.optional(),
    })
    .refine(
      (data) => Object.values(data).some((value) => value !== undefined),
      {
        message: 'At least one field must be provided',
      }
    ),
});
