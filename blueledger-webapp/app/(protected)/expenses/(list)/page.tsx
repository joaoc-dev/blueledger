import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ExpensesTable from '@/components/expenses/expenses-table';
import { getQueryClient } from '@/lib/react-query/get-query-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
// import { getExpenses } from '@/services/expenses';
import { getExpenses } from '@/lib/data/expenses';

const ServerGetExpenses = async () => {
  console.log('ServerGetExpenses');

  return getExpenses().then((expenses) => {
    console.log('ServerGetExpenses', expenses);
    return expenses;
  });
};

const ExpensesPage = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['expenses'],
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

export const dynamic = 'force-dynamic';

export default ExpensesPage;
