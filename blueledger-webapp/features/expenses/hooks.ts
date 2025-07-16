import { expenseKeys } from '@/constants/query-keys';
import {
  createExpense,
  deleteExpense,
  updateExpense,
} from '@/features/expenses/client';
import {
  ExpenseFormData,
  expenseFormSchema,
} from '@/features/expenses/schemas';
import { getQueryClient } from '@/lib/react-query/get-query-client';
import { ExpenseType } from '@/types/expense';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

interface ExpensesContext {
  previousExpenses: ExpenseType[];
  optimisticExpense?: ExpenseType;
}

// Mutations: Optimistic with manual cache manipulation and NO query invalidation
export function useExpenses() {
  const queryClient = getQueryClient();

  const applyOptimisticMutation = async (
    updateQueryFunction: (expenses: ExpenseType[]) => ExpenseType[],
    optimisticExpense?: ExpenseType
  ) => {
    await queryClient.cancelQueries({ queryKey: expenseKeys.byUser });

    const previousExpenses =
      queryClient.getQueryData<ExpenseType[]>(expenseKeys.byUser) || [];

    const updatedExpenses = updateQueryFunction(previousExpenses);

    queryClient.setQueryData<ExpenseType[]>(
      expenseKeys.byUser,
      updatedExpenses
    );

    return { previousExpenses, optimisticExpense };
  };

  const applyNewMutationResult = (
    mutationResult: ExpenseType,
    optimisticId: string
  ) => {
    queryClient.setQueryData<ExpenseType[]>(expenseKeys.byUser, (expenses) =>
      expenses?.map((expense) =>
        expense.optimisticId === optimisticId ? mutationResult : expense
      )
    );
  };

  const applyUpdateMutationResult = (
    mutationResult: ExpenseType,
    id: string
  ) => {
    queryClient.setQueryData<ExpenseType[]>(expenseKeys.byUser, (expenses) =>
      expenses?.map((expense) => (expense.id === id ? mutationResult : expense))
    );
  };

  const rollbackMutation = (previousExpenses: ExpenseType[] | undefined) => {
    if (!previousExpenses) return;

    queryClient.setQueryData<ExpenseType[]>(
      expenseKeys.byUser,
      previousExpenses
    );
  };

  const addExpenseMutation = useMutation<
    ExpenseType,
    Error,
    ExpenseFormData,
    ExpensesContext
  >({
    mutationFn: createExpense,

    onMutate: async (newExpense: ExpenseFormData) => {
      const optimisticExpense: ExpenseType = {
        ...newExpense,
        optimisticId: uuidv4(),
        totalPrice: newExpense.price * newExpense.quantity,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updateQueryFunction = (expenses: ExpenseType[]) => [
        optimisticExpense,
        ...expenses,
      ];

      return await applyOptimisticMutation(
        updateQueryFunction,
        optimisticExpense
      );
    },

    onSuccess: async (mutationResult, newExpense, context) => {
      applyNewMutationResult(
        mutationResult,
        context?.optimisticExpense!.optimisticId!
      );
    },

    onError: (error, newExpense, context) => {
      rollbackMutation(context?.previousExpenses);
    },
  });

  const updateExpenseMutation = useMutation<
    ExpenseType,
    Error,
    { id: string; updatedExpense: ExpenseFormData },
    ExpensesContext
  >({
    mutationFn: ({ id, updatedExpense }) => updateExpense(id, updatedExpense),

    onMutate: async ({ id, updatedExpense }) => {
      const optimisticExpense: ExpenseType = {
        ...updatedExpense,
        id,
        totalPrice: updatedExpense.price * updatedExpense.quantity,
        updatedAt: new Date(),
      };

      const updateQueryFunction = (expenses: ExpenseType[]) =>
        expenses.map((expense) =>
          expense.id === id ? optimisticExpense : expense
        );

      return await applyOptimisticMutation(
        updateQueryFunction,
        optimisticExpense
      );
    },

    onSuccess: async (mutationResult, updatedExpense, context) => {
      applyUpdateMutationResult(
        mutationResult,
        context?.optimisticExpense!.optimisticId!
      );
    },

    onError: (error, updatedExpense, context) => {
      rollbackMutation(context?.previousExpenses);
    },
  });

  const deleteExpenseMutation = useMutation<
    void,
    Error,
    string,
    ExpensesContext
  >({
    mutationFn: deleteExpense,

    onMutate: async (id) => {
      const updateQueryFunction = (expenses: ExpenseType[]) =>
        expenses.filter((expense) => expense.id !== id);

      return await applyOptimisticMutation(updateQueryFunction);
    },

    onError: (error, id, context) => {
      rollbackMutation(context?.previousExpenses);
    },
  });

  return {
    addExpenseMutation,
    updateExpenseMutation,
    deleteExpenseMutation,
  };
}

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
