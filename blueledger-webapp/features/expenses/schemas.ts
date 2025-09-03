import { Types } from 'mongoose';
import { z } from 'zod';
import { EXPENSE_CATEGORIES_VALUES } from './constants';

const descriptionSchema = z
  .string()
  .trim()
  .min(1, { message: 'Description is required' })
  .max(200, { message: 'Description must be less than 200 characters' });

const priceSchema = z.number().min(0, { message: 'Price cannot be negative' });

const quantitySchema = z.coerce
  .number({ invalid_type_error: 'Quantity must be a number' })
  .min(1, { message: 'Quantity must be greater than 0' });

const categorySchema = z.enum(EXPENSE_CATEGORIES_VALUES);

const dateSchema = z.date({
  required_error: 'Date is required',
  invalid_type_error: 'Date must be a valid date',
});

const expenseBaseSchema = {
  description: descriptionSchema,
  price: priceSchema,
  quantity: quantitySchema,
  category: categorySchema,
};

export const expenseFormSchema = z.object({
  ...expenseBaseSchema,
  date: dateSchema,
});

export type ExpenseFormData = z.infer<typeof expenseFormSchema>;

const dateStringToDateSchema = z
  .string()
  .transform(str => new Date(str))
  .refine(date => !Number.isNaN(date.getTime()), { message: 'Invalid date' });

export const createExpenseSchema = z.strictObject({
  data: z.strictObject({
    ...expenseBaseSchema,
    user: z.string().refine(Types.ObjectId.isValid, { message: 'Invalid ID' }),
    date: dateStringToDateSchema,
  }),
});

export type CreateExpenseData = z.infer<typeof createExpenseSchema>;

export const patchExpenseSchema = z.object({
  id: z.string().refine(Types.ObjectId.isValid, { message: 'Invalid ID' }),
  data: z
    .strictObject({
      description: descriptionSchema.optional(),
      price: priceSchema.optional(),
      quantity: quantitySchema.optional(),
      category: categorySchema.optional(),
      date: dateStringToDateSchema.optional(),
    })
    .refine(
      data => Object.values(data).some(value => value !== undefined),
      {
        message: 'At least one field must be provided',
      },
    ),
});

export type PatchExpenseData = z.infer<typeof patchExpenseSchema>;

export const deleteExpenseSchema = z.strictObject({
  id: z.string().refine(Types.ObjectId.isValid, { message: 'Invalid ID' }),
});

export const expenseDisplaySchema = z.object({
  id: z.string().optional(),
  optimisticId: z.string().optional(),
  user: z.object({ id: z.string() }).optional(),
  description: z.string().min(1).max(200),
  price: z.number().min(0),
  quantity: z.number().min(1),
  totalPrice: z.number(),
  category: z.enum(EXPENSE_CATEGORIES_VALUES),
  date: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ExpenseDisplay = z.infer<typeof expenseDisplaySchema>;

export const expenseApiResponseSchema = expenseDisplaySchema.extend({
  date: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ExpenseApiResponse = z.infer<typeof expenseApiResponseSchema>;
