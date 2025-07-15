import { ExpenseCategory } from '@/constants/expense-category';
import { UserType } from './user';

export interface ExpenseType {
  id?: string;
  optimisticId?: string; // for optimistic updates
  user?: Partial<UserType>;
  description: string;
  price: number;
  quantity: number;
  totalPrice: number;
  category: ExpenseCategory;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
