'use client';

import { Button } from '@/components/ui/button';
import { expenseKeys } from '@/constants/query-keys';
import { getQueryClient } from '@/lib/react-query/get-query-client';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { getExpenses } from '../../client';
import { DataTable } from './data-table';

const ClientGetExpenses = async () => {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const expenses = await getExpenses();
  // console.log('ClientGetExpenses', expenses);
  return expenses;
};

const ExpensesTable = () => {
  const queryClient = getQueryClient();
  const searchParams = useSearchParams();

  const description = searchParams.get('description') ?? '';

  const {
    data: expenses,
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
            queryClient.invalidateQueries({ queryKey: [expenseKeys.byUser] })
          }
        >
          Retry
        </Button>
      </div>
    );
  }

  return <DataTable data={expenses || []} isFetching={isFetching} />;
};

export default ExpensesTable;
