import { ExpenseCategory } from '@/constants/expense-category';

export interface ExpenseType {
  id: string;
  description: string;
  price: number;
  quantity: number;
  totalPrice: number;
  category: ExpenseCategory;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}
