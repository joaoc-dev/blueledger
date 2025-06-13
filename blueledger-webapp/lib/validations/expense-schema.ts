import { Types } from 'mongoose';
import { z } from 'zod';
import { EXPENSE_CATEGORIES } from '@/constants/expense-category';

const baseSchema = z.object({
  id: z.string().optional(),
  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .max(200, { message: 'Description must be less than 200 characters' }),
  price: z.number().min(0, { message: 'Price cannot be negative' }),
  quantity: z.number().min(1, { message: 'Quantity must be greater than 0' }),
  category: z.enum(EXPENSE_CATEGORIES),
  date: z.date({
    required_error: 'Date is required',
    invalid_type_error: 'Date must be a valid date',
  }),
});

export const createExpenseSchema = baseSchema.extend({
  date: z
    .string()
    .transform((str) => new Date(str))
    .refine((date) => !isNaN(date.getTime()), {
      message: 'Invalid date',
    }),
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
    category: z.enum(EXPENSE_CATEGORIES).optional(),
    date: z
      .string()
      .transform((str) => new Date(str))
      .refine((date) => !isNaN(date.getTime()), {
        message: 'Invalid date',
      })
      .optional(),
  }),
});

export const deleteExpenseSchema = z.object({
  params: z.object({
    id: z.string().refine(Types.ObjectId.isValid, { message: 'Invalid ID' }),
  }),
});

export const expenseFormSchema = baseSchema.extend({
  date: z.date(),
});

export type ExpenseFormData = z.infer<typeof expenseFormSchema>;
