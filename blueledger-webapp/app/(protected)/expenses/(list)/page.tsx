import { Button } from '@/components/ui/button';
import dbConnect from '@/lib/db/client';
import Expense from '@/models/expense';
import Link from 'next/link';
import ExpensesTable from './expenses-table';

const ExpensesPage = async () => {
  await dbConnect();

  const expenses = await Expense.find();

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
