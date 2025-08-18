import { Types } from 'mongoose';
import { z } from 'zod';

const idSchema = z
  .string()
  .refine(Types.ObjectId.isValid, { message: 'Invalid ID' });
const nameSchema = z.string().min(1, { message: 'Name is required' });
const emailSchema = z.string().email({ message: 'Invalid email' }).toLowerCase();
const imageSchema = z.string().optional();
const imagePublicIdSchema = z.string().optional();
const bioSchema = z.string().optional();
const emailVerifiedSchema = z.date().optional();

const baseFields = {
  name: nameSchema,
  email: emailSchema,
  bio: bioSchema,
};

export const userProfileFormSchema = z.object({
  ...baseFields,
});

export type UserProfileFormData = z.infer<typeof userProfileFormSchema>;

const passwordSchema = z.string().min(8).max(72);

export const createUserSchema = z.object({
  ...baseFields,
  password: passwordSchema,
});

export type CreateUserData = z.infer<typeof createUserSchema>;

export const patchUserSchema = z.object({
  id: idSchema,
  data: z
    .strictObject({
      name: nameSchema.optional(),
      image: imageSchema.optional(),
      imagePublicId: imagePublicIdSchema.optional(),
      bio: bioSchema.optional(),
      emailVerified: emailVerifiedSchema.optional(),
      emailVerificationCode: z.string().optional(),
      emailVerificationCodeExpires: z.date().optional(),
    })
    .refine(
      data => Object.values(data).some(value => value !== undefined),
      {
        message: 'At least one field must be provided',
      },
    ),
});

export type PatchUserData = z.infer<typeof patchUserSchema>;

const userDisplaySchema = z.object({
  ...baseFields,
  id: idSchema,
  image: z.string().optional(),
  imagePublicId: z.string().optional(),
  emailVerified: z.date().optional(),
});

export type UserDisplay = z.infer<typeof userDisplaySchema>;

export const userApiResponseSchema = userDisplaySchema.extend({});

export type UserApiResponse = z.infer<typeof userApiResponseSchema>;
