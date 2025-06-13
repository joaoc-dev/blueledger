import { Types } from 'mongoose';
import { z } from 'zod';
import { EXPENSE_CATEGORIES } from '@/constants/expense-category';

const idSchema = z.string().optional();

const descriptionSchema = z
  .string()
  .min(1, { message: 'Description is required' })
  .max(200, { message: 'Description must be less than 200 characters' });

const priceSchema = z.number().min(0, { message: 'Price cannot be negative' });

const quantitySchema = z
  .number()
  .min(1, { message: 'Quantity must be greater than 0' });

const categorySchema = z.enum(EXPENSE_CATEGORIES);

const dateSchema = z.date({
  required_error: 'Date is required',
  invalid_type_error: 'Date must be a valid date',
});

const baseFields = {
  id: idSchema,
  description: descriptionSchema,
  price: priceSchema,
  quantity: quantitySchema,
  category: categorySchema,
};

export const expenseFormSchema = z.object({
  ...baseFields,
  date: dateSchema,
});

export type ExpenseFormData = z.infer<typeof expenseFormSchema>;

/* API Schemas */
const dateStringToDateSchema = z
  .string()
  .transform((str) => new Date(str))
  .refine((date) => !isNaN(date.getTime()), { message: 'Invalid date' });

export const createExpenseSchema = z.strictObject({
  ...baseFields,
  date: dateStringToDateSchema,
});

export type CreateExpenseData = z.infer<typeof createExpenseSchema>;

export const patchExpenseSchema = z.object({
  params: z.object({
    id: z.string().refine(Types.ObjectId.isValid, { message: 'Invalid ID' }),
  }),
  body: z
    .strictObject({
      description: descriptionSchema.optional(),
      price: priceSchema.optional(),
      quantity: quantitySchema.optional(),
      category: categorySchema.optional(),
      date: dateStringToDateSchema.optional(),
    })
    .refine(
      (data) => Object.values(data).some((value) => value !== undefined),
      {
        message: 'At least one field must be provided',
      }
    ),
});

export const deleteExpenseSchema = z.strictObject({
  params: z.object({
    id: z.string().refine(Types.ObjectId.isValid, { message: 'Invalid ID' }),
  }),
});
