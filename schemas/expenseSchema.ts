import { Types } from 'mongoose';
import { z } from 'zod';

export const expenseSchema = z.object({
  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .max(200, { message: 'Description must be less than 200 characters' }),
  price: z.number().min(1, { message: 'Price must be greater than 0' }),
  quantity: z.number().min(1, { message: 'Quantity must be greater than 0' }),
});

export const deleteExpenseSchema = z.object({
  params: z.object({
    id: z.string().refine(Types.ObjectId.isValid, { message: 'Invalid ID' }),
  }),
});

export type Expense = z.infer<typeof expenseSchema>;
