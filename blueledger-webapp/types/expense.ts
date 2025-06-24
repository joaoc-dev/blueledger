import { ExpenseCategory } from '@/constants/expense-category';

export interface ExpenseType {
  id: string;
  optimisticId?: string; // for optimistic updates
  description: string;
  price: number;
  quantity: number;
  totalPrice: number;
  category: ExpenseCategory;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}
