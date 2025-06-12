import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ExpensesTable from '@/components/expenses/expenses-table';
import { getExpenses } from '@/lib/data/expenses';

const ExpensesPage = async () => {
  const expenses = await getExpenses();
  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button asChild>
          <Link href="/expenses/new">New Expense</Link>
        </Button>
      </div>
      <ExpensesTable expenses={expenses} />
    </div>
  );
};

export const dynamic = 'force-dynamic';

export default ExpensesPage;
