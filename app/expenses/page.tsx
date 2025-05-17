import { Button } from '@/components/ui/button';
import dbConnect from '@/mongoose/client';
import Expense from '@/mongoose/models/Expense';
import Link from 'next/link';

const ExpensesPage = async () => {
  await dbConnect();

  const expenses = await Expense.find();

  return (
    <div>
      <Button asChild>
        <Link href="/expenses/new">New Expense</Link>
      </Button>
      <ul>
        {expenses.map((expense) => (
          <li key={expense._id?.toString()}>
            <h1>{expense.description as string}</h1>
            <p>{expense.price as number}</p>
            <p>{expense.quantity as number}</p>
            <p>{expense.totalPrice as number}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpensesPage;
