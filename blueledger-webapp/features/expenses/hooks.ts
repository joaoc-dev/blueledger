import type { ExpenseDisplay, ExpenseFormData } from './schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { expenseKeys } from '@/constants/query-keys';
import { getQueryClient } from '@/lib/react-query/get-query-client';
import { createExpense, deleteExpense, updateExpense } from './client';
import { expenseFormSchema } from './schemas';

interface ExpensesContext {
  previousExpenses: ExpenseDisplay[];
  optimisticExpense?: ExpenseDisplay;
}

// Mutations: Optimistic with manual cache manipulation and NO query invalidation
export function useExpenses() {
  const queryClient = getQueryClient();

  function sortByDateDesc(expenses: ExpenseDisplay[]): ExpenseDisplay[] {
    return [...expenses].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }

  const applyOptimisticMutation = async (
    updateQueryFunction: (expenses: ExpenseDisplay[]) => ExpenseDisplay[],
    optimisticExpense?: ExpenseDisplay,
  ) => {
    await queryClient.cancelQueries({ queryKey: expenseKeys.byUser });

    const previousExpenses
      = queryClient.getQueryData<ExpenseDisplay[]>(expenseKeys.byUser) || [];

    const updatedExpenses = updateQueryFunction(previousExpenses);

    queryClient.setQueryData<ExpenseDisplay[]>(
      expenseKeys.byUser,
      updatedExpenses,
    );

    return { previousExpenses, optimisticExpense };
  };

  const applyNewMutationResult = (
    mutationResult: ExpenseDisplay,
    optimisticId: string,
  ) => {
    queryClient.setQueryData<ExpenseDisplay[]>(expenseKeys.byUser, expenses =>
      sortByDateDesc(
        expenses?.map(expense =>
          expense.optimisticId === optimisticId ? mutationResult : expense,
        ) || [],
      ));
  };

  const applyUpdateMutationResult = (
    mutationResult: ExpenseDisplay,
    id: string,
  ) => {
    queryClient.setQueryData<ExpenseDisplay[]>(expenseKeys.byUser, expenses =>
      expenses?.map(expense => (expense.id === id ? mutationResult : expense)));
  };

  const rollbackMutation = (previousExpenses: ExpenseDisplay[] | undefined) => {
    if (!previousExpenses)
      return;

    queryClient.setQueryData<ExpenseDisplay[]>(
      expenseKeys.byUser,
      previousExpenses,
    );
  };

  const addExpenseMutation = useMutation<
    ExpenseDisplay,
    Error,
    ExpenseFormData,
    ExpensesContext
  >({
    mutationFn: createExpense,

    onMutate: async (newExpense: ExpenseFormData) => {
      const optimisticExpense: ExpenseDisplay = {
        ...newExpense,
        optimisticId: uuidv4(),
        totalPrice: newExpense.price * newExpense.quantity,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updateQueryFunction = (expenses: ExpenseDisplay[]) =>
        sortByDateDesc([optimisticExpense, ...expenses]);

      return await applyOptimisticMutation(
        updateQueryFunction,
        optimisticExpense,
      );
    },

    onSuccess: async (mutationResult, newExpense, context) => {
      if (!context?.optimisticExpense)
        return;

      applyNewMutationResult(
        mutationResult,
        context.optimisticExpense.optimisticId!,
      );
    },

    onError: (error, newExpense, context) => {
      console.error('Failed to add expense: ', error, newExpense);
      rollbackMutation(context?.previousExpenses);
    },
  });

  const updateExpenseMutation = useMutation<
    ExpenseDisplay,
    Error,
    { id: string; updatedExpense: ExpenseFormData },
    ExpensesContext
  >({
    mutationFn: ({ id, updatedExpense }) => updateExpense(id, updatedExpense),

    onMutate: async ({ id, updatedExpense }) => {
      const optimisticExpense: ExpenseDisplay = {
        ...updatedExpense,
        id,
        totalPrice: updatedExpense.price * updatedExpense.quantity,
        updatedAt: new Date(),
        createdAt: new Date(),
      };

      const updateQueryFunction = (expenses: ExpenseDisplay[]) =>
        expenses.map(expense =>
          expense.id === id ? optimisticExpense : expense,
        );

      return await applyOptimisticMutation(
        updateQueryFunction,
        optimisticExpense,
      );
    },

    onSuccess: async (mutationResult, updatedExpense, context) => {
      if (!context?.optimisticExpense)
        return;

      applyUpdateMutationResult(
        mutationResult,
        context.optimisticExpense.optimisticId!,
      );
    },

    onError: (error, updatedExpense, context) => {
      console.error('Failed to update expense: ', error, updatedExpense);
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
      const updateQueryFunction = (expenses: ExpenseDisplay[]) =>
        expenses.filter(expense => expense.id !== id);

      return await applyOptimisticMutation(updateQueryFunction);
    },

    onError: (error, id, context) => {
      console.error('Failed to delete expense: ', error, id);
      rollbackMutation(context?.previousExpenses);
    },
  });

  return {
    addExpenseMutation,
    updateExpenseMutation,
    deleteExpenseMutation,
  };
}

export function useExpenseForm(expense?: ExpenseDisplay) {
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
}
