import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getQueryClient } from '@/lib/react-query/get-query-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getExpenses } from '@/lib/data/expenses';
import ExpensesTable from '@/components/expenses/expenses-table';
import { expenseKeys } from '@/constants/query-keys';

const ServerGetExpenses = async () => {
  // console.log('ServerGetExpenses');

  await new Promise((resolve) => setTimeout(resolve, 1000));
  return getExpenses().then((expenses) => {
    // console.log('ServerGetExpenses', expenses);
    return expenses;
  });
};

const ExpensesPage = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: expenseKeys.byUser,
    queryFn: ServerGetExpenses,
  });

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button asChild>
          <Link href="/expenses/new">New Expense</Link>
        </Button>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ExpensesTable />
      </HydrationBoundary>
    </div>
  );
};

export default ExpensesPage;
