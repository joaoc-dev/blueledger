import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import dbConnect from '@/mongoose/client';
import Expense from '@/mongoose/models/Expense';
import Link from 'next/link';

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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead></TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense._id?.toString()}>
              <TableCell>{expense.description as string}</TableCell>
              <TableCell>{expense.price as number}</TableCell>
              <TableCell>{expense.quantity as number}</TableCell>
              <TableCell>{expense.totalPrice as number}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExpensesPage;
