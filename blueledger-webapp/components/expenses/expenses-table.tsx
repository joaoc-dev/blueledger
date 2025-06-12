'use client';

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
import { toast } from 'sonner';
import { deleteExpense } from '@/services/expenses';
import { useState } from 'react';
import { CATEGORY_ICONS, ExpenseCategory } from '@/constants/expense-category';
import { CircleEllipsis } from 'lucide-react';

interface ExpensesTableProps {
  expenses: ExpenseType[];
}

const ExpensesTable = ({ expenses }: ExpensesTableProps) => {
  const [localExpenses, setLocalExpenses] = useState(expenses);

  const handleDelete = async (id: string) => {
    const originalExpenses = [...localExpenses];
    try {
      setLocalExpenses(localExpenses.filter((expense) => expense.id !== id));
      await deleteExpense(id);

      toast.success('Expense deleted successfully');
    } catch (error) {
      setLocalExpenses(originalExpenses);
      console.error(error);
      toast.error('Failed to delete expense');
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">Quantity</TableHead>
          <TableHead className="text-right">Total Price</TableHead>
          <TableHead></TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {localExpenses.map((expense) => {
          const Icon = expense.category
            ? CATEGORY_ICONS[expense.category as ExpenseCategory]
            : CircleEllipsis;

          return (
            <TableRow key={expense.id}>
              <TableCell>{expense.description as string}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {expense.category ? expense.category : 'Other'}
                </div>
              </TableCell>
              <TableCell className="w-30 text-right">
                {expense.price as number}
              </TableCell>
              <TableCell className="w-30 text-right">
                {expense.quantity as number}
              </TableCell>
              <TableCell className="w-30 text-right">
                {expense.totalPrice as number}
              </TableCell>
              <ExpenseRowActions
                id={expense.id}
                onDelete={() => handleDelete(expense.id)}
              />
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ExpensesTable;
