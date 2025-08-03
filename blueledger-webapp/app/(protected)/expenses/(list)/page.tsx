import { expenseKeys } from '@/constants/query-keys';
import { ExpensesTable } from '@/features/expenses/components';
import { getExpenses } from '@/features/expenses/data';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

// We implement a short minimum delay to avoid snappy UI
const delayedGetExpenses = async () => {
  const [, expenses] = await Promise.all([
    new Promise((resolve) => setTimeout(resolve, 800)),
    getExpenses(),
  ]);
  return expenses;
};

const ExpensesPage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: expenseKeys.byUser,
    queryFn: delayedGetExpenses,
  });

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ExpensesTable />
      </HydrationBoundary>
    </div>
  );
};

export default ExpensesPage;
