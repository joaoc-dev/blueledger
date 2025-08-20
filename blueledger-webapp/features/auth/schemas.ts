import { z } from 'zod';
import { VERIFICATION_CODE_LENGTH } from './constants';

export const validationCodeSchema = z.string()
  .regex(new RegExp(`^\\d{${VERIFICATION_CODE_LENGTH}}$`));

const emailSchema = z.string().email({ message: 'Invalid email' });
const passwordSchema = z.string().min(8, { message: 'At least 8 characters' }).max(72);

export const apiValidationCodeSchema = z.object({
  code: validationCodeSchema,
});

export const emailPasswordResetSchema = z.object({
  email: emailSchema,
});

export const passwordResetFormSchema = z
  .object({
    email: emailSchema,
    code: validationCodeSchema,
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type PasswordResetFormData = z.infer<typeof passwordResetFormSchema>;

export const passwordResetConfirmSchema = z.object({
  email: emailSchema,
  code: validationCodeSchema,
  newPassword: passwordSchema,
});

export type PasswordResetConfirmData = z.infer<typeof passwordResetConfirmSchema>;

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: 'Password is required' }),
});

export type SignInFormData = z.infer<typeof signInSchema>;

export const signupFormSchema = z
  .object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignupFormData = z.infer<typeof signupFormSchema>;
