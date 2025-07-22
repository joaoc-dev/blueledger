'use client';

import { getExpenses } from '../../client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { getQueryClient } from '@/lib/react-query/get-query-client';
import { DataTable } from '@/components/shared/data-table/data-table';
import { columns } from './columns';
import { expenseKeys } from '@/constants/query-keys';

const ClientGetExpenses = async () => {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const expenses = await getExpenses();
  // console.log('ClientGetExpenses', expenses);
  return expenses;
};

const ExpensesTable = () => {
  const queryClient = getQueryClient();

  const {
    data: expenses,
    // isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: expenseKeys.byUser,
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
