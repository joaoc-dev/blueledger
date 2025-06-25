'use client';

// import { ExpenseType } from '@/types/expense';
// import { toast } from 'sonner';
// import { deleteExpense, getExpenses } from '@/services/expenses';
// import { useState } from 'react';
import { getExpenses } from '@/services/expenses';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../../ui/button';
import { getQueryClient } from '@/lib/react-query/get-query-client';
import { DataTable } from '../../shared/data-table/data-table';
import { columns } from './columns';

const ClientGetExpenses = async () => {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const expenses = await getExpenses();
  // console.log('ClientGetExpenses', expenses);
  return expenses;
};

const handleDelete = async (id: string) => {
  // const originalExpenses = [...localExpenses];
  // try {
  //   setLocalExpenses(localExpenses.filter((expense) => expense.id !== id));
  //   await deleteExpense(id);
  //   toast.success('Expense deleted successfully');
  // } catch (error) {
  //   setLocalExpenses(originalExpenses);
  //   console.error(error);
  //   toast.error('Failed to delete expense');
  // }
};

const ExpensesTable = () => {
  const queryClient = getQueryClient();

  const {
    data: expenses,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ['expenses'],
    queryFn: ClientGetExpenses,
  });

  if (isError) {
    return (
      <div className="flex flex-col gap-4 w-[500px] mx-auto items-center justify-center h-[500px]">
        Error: {error.message}
        <Button
          disabled={isFetching}
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ['expenses'] })
          }
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <DataTable storageKey="expenses" columns={columns} data={expenses || []} />
  );
};

export default ExpensesTable;
