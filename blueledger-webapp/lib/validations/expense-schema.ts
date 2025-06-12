import { Types } from 'mongoose';
import { z } from 'zod';

export const expenseSchema = z.object({
  id: z.string().optional(),
  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .max(200, { message: 'Description must be less than 200 characters' }),
  price: z.number().min(0, { message: 'Price cannot be negative' }),
  quantity: z.number().min(1, { message: 'Quantity must be greater than 0' }),
});

export const patchExpenseSchema = z.object({
  params: z.object({
    id: z.string().refine(Types.ObjectId.isValid, { message: 'Invalid ID' }),
  }),
  body: z.object({
    description: z
      .string()
      .min(1, { message: 'Description is required' })
      .max(200, { message: 'Description must be less than 200 characters' })
      .optional(),
    price: z
      .number()
      .min(0, { message: 'Price cannot be negative' })
      .optional(),
    quantity: z
      .number()
      .min(1, { message: 'Quantity must be greater than 0' })
      .optional(),
  }),
});

export const deleteExpenseSchema = z.object({
  params: z.object({
    id: z.string().refine(Types.ObjectId.isValid, { message: 'Invalid ID' }),
  }),
});

export const expenseFormSchema = expenseSchema;

export type ExpenseFormData = z.infer<typeof expenseFormSchema>;
