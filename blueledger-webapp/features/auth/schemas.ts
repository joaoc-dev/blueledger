import { z } from 'zod';
import { VERIFICATION_CODE_LENGTH } from './constants';

export const validationCodeSchema = z.string().regex(new RegExp(`^\\d{${VERIFICATION_CODE_LENGTH}}$`));

export const apiValidationCodeSchema = z.object({
  code: validationCodeSchema,
});

export const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export type SignInFormData = z.infer<typeof signInSchema>;

export const signupFormSchema = z
  .object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().email({ message: 'Invalid email' }),
    password: z.string().min(8, { message: 'At least 8 characters' }),
    confirmPassword: z.string().min(8, { message: 'At least 8 characters' }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignupFormData = z.infer<typeof signupFormSchema>;
