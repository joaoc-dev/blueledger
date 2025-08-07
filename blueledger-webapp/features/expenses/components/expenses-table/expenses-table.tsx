'use client';

import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { expenseKeys } from '@/constants/query-keys';
import { ExpensesTableSkeleton } from '@/features/expenses/components';
import { useIsMobile } from '@/hooks/useIsMobile';
import { getQueryClient } from '@/lib/react-query/get-query-client';
import { getExpenses } from '../../client';
import { DataTable } from './data-table';
import { StackedList } from './stacked-list';

// We implement a short minimum delay to avoid snappy UI
async function delayedGetExpenses() {
  const [, expenses] = await Promise.all([
    new Promise(resolve => setTimeout(resolve, 800)),
    getExpenses(),
  ]);
  return expenses;
}

function ExpensesTable() {
  const isMobile = useIsMobile();

  const queryClient = getQueryClient();

  const {
    data: expenses,
    isFetching,
    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: expenseKeys.byUser,
    queryFn: delayedGetExpenses,
  });

  if (isMobile === undefined)
    return <ExpensesTableSkeleton />;

  if (isError) {
    console.error('error', error.message);
    return (
      <div className="flex flex-col gap-4 mx-auto items-center justify-center h-[500px]">
        Unexpected error. Please try again.
        <Button
          disabled={isFetching}
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: [expenseKeys.byUser] })}
        >
          Retry
        </Button>
      </div>
    );
  }

  return isMobile
    ? (
        <StackedList
          data={expenses || []}
          isFetching={isFetching}
          isLoading={isLoading}
        />
      )
    : (
        <DataTable
          data={expenses || []}
          isFetching={isFetching}
          isLoading={isLoading}
        />
      );
}

export default ExpensesTable;
