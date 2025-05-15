import { z } from 'zod';

export const expenseSchema = z.object({
  description: z.string().min(1),
  price: z.number().min(0),
  quantity: z.number().min(1),
  totalPrice: z.number().min(0),
});

export type Expense = z.infer<typeof expenseSchema>;
