import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ExpenseFormData,
  expenseFormSchema,
} from '@/lib/validations/expense-schema';
import { ExpenseType } from '@/types/expense';

export const useExpenseForm = (expense?: ExpenseType) => {
  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      description: expense?.description || '',
      price: expense?.price || 0,
      quantity: expense?.quantity || 0,
      category: expense?.category || 'Other',
      date: expense?.date || new Date(),
    },
  });

  return form;
};
