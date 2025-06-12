import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import ExpenseRowActions from './expense-row-actions';
import { ExpenseType } from '@/types/expense';

interface ExpensesTableProps {
  expenses: ExpenseType[];
}

const ExpensesTable = ({ expenses }: ExpensesTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">Quantity</TableHead>
          <TableHead className="text-right">Total Price</TableHead>
          <TableHead></TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.map((expense) => (
          <TableRow key={expense.id}>
            <TableCell>{expense.description as string}</TableCell>
            <TableCell className="w-30 text-right">
              {expense.price as number}
            </TableCell>
            <TableCell className="w-30 text-right">
              {expense.quantity as number}
            </TableCell>
            <TableCell className="w-30 text-right">
              {expense.totalPrice as number}
            </TableCell>
            <ExpenseRowActions id={expense.id} />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ExpensesTable;
