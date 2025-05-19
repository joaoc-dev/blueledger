import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ExpenseDocument } from '@/mongoose/models/Expense';
import ExpenseRowActions from './expense-row-actions';

interface ExpensesTableProps {
  expenses: ExpenseDocument[];
}

const ExpensesTable = ({ expenses }: ExpensesTableProps) => {
  return (
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
            <ExpenseRowActions id={expense._id?.toString() as string} />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ExpensesTable;
