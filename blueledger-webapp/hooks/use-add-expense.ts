import { getQueryClient } from '@/lib/react-query/get-query-client';
import { createExpense } from '@/services/expenses';
import { ExpenseFormData } from '@/lib/validations/expense-schema';
import { ExpenseType } from '@/types/expense';
import { useMutation } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import { delay } from '@/lib/utils/delay';

interface AddExpenseContext {
  previousExpenses: ExpenseType[];
  optimisticExpense: ExpenseType;
}

const queryClient = getQueryClient();

// Optimistic with manual cache manipulation without query invalidation
export const useAddExpense = () =>
  useMutation<ExpenseType, Error, ExpenseFormData, AddExpenseContext>({
    mutationFn: createExpense,

    onMutate: async (newExpense: ExpenseFormData) => {
      await queryClient.cancelQueries({ queryKey: ['expenses'] });

      const previousExpenses =
        queryClient.getQueryData<ExpenseType[]>(['expenses']) || [];

      const optimisticExpense = {
        ...newExpense,
        id: null,
        optimisticId: uuidv4(),
        totalPrice: newExpense.price * newExpense.quantity,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as ExpenseType;

      queryClient.setQueryData<ExpenseType[]>(['expenses'], (expenses = []) => [
        optimisticExpense,
        ...expenses,
      ]);

      return { previousExpenses, optimisticExpense };
    },

    onSuccess: async (mutationResult, newExpense, context) => {
      await delay(4000);

      queryClient.setQueryData<ExpenseType[]>(['expenses'], (expenses) =>
        expenses?.map((expense) =>
          expense.optimisticId === context?.optimisticExpense.optimisticId
            ? mutationResult
            : expense
        )
      );
    },

    onError: (error, newExpense, context) => {
      if (!context) return;

      queryClient.setQueryData<ExpenseType[]>(
        ['expenses'],
        context.previousExpenses
      );
    },
  });
