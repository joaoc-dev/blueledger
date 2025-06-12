import { ExpenseCategory } from '@/constants/expense-category';

export interface ExpenseType {
  id: string;
  description: string;
  price: number;
  quantity: number;
  totalPrice: number;
  category: ExpenseCategory;
  createdAt: Date;
  updatedAt: Date;
}
