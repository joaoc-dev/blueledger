import { Button } from '@/components/ui/button';
import { expenseKeys } from '@/constants/query-keys';
import { ExpensesTable } from '@/features/expenses/components';
import { getExpenses } from '@/features/expenses/data';
import { getQueryClient } from '@/lib/react-query/get-query-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import Link from 'next/link';

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
