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
// import { ExpenseType } from '@/types/expense';
// import { toast } from 'sonner';
// import { deleteExpense, getExpenses } from '@/services/expenses';
// import { useState } from 'react';
import { getExpenses } from '@/services/expenses';
import { CATEGORY_ICONS, ExpenseCategory } from '@/constants/expense-category';
import { CircleEllipsis } from 'lucide-react';
import { formatLocalizedDate } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { getQueryClient } from '@/lib/react-query/get-query-client';
import clsx from 'clsx';

// interface ExpensesTableProps {
//   expenses: ExpenseType[];
// }

const ClientGetExpenses = async () => {
  console.log('ClientGetExpenses');

  await new Promise((resolve) => setTimeout(resolve, 5000));

  const expenses = await getExpenses();
  console.log('ClientGetExpenses', expenses);
  return expenses;
};

const ExpensesTable = () => {
  // const [localExpenses, setLocalExpenses] = useState(expenses);
  const queryClient = getQueryClient();

  const {
    data: expenses,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ['expenses'],
    queryFn: ClientGetExpenses,
  });

  const handleDelete = async (id: string) => {
    // const originalExpenses = [...localExpenses];
    // try {
    //   setLocalExpenses(localExpenses.filter((expense) => expense.id !== id));
    //   await deleteExpense(id);
    //   toast.success('Expense deleted successfully');
    // } catch (error) {
    //   setLocalExpenses(originalExpenses);
    //   console.error(error);
    //   toast.error('Failed to delete expense');
    // }
  };

  if (isError) {
    return (
      <div className="flex flex-col gap-4 w-[500px] mx-auto items-center justify-center h-[500px]">
        Error: {error.message}
        <Button
          disabled={isFetching}
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ['expenses'] })
          }
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Quantity</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">Total Price</TableHead>
          <TableHead></TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses?.map((expense) => {
          const Icon =
            expense.category && expense.category in CATEGORY_ICONS
              ? CATEGORY_ICONS[expense.category as ExpenseCategory]
              : CircleEllipsis;

          const isNewExpense = !!expense.optimisticId;

          console.log('expense', expense);
          return (
            <TableRow
              key={expense.id || expense.optimisticId}
              className={clsx(isNewExpense && 'bg-foreground/10 animate-pulse')}
            >
              <TableCell>{expense.description as string}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {expense.category ? expense.category : 'Other'}
                </div>
              </TableCell>
              <TableCell>
                {expense.date ? formatLocalizedDate(expense.date) : ''}
              </TableCell>
              <TableCell className="w-30 text-right">
                {expense.quantity as number}
              </TableCell>
              <TableCell className="w-30 text-right">
                {expense.price as number}
              </TableCell>
              <TableCell className="w-30 text-right">
                {expense.totalPrice as number}
              </TableCell>
              <ExpenseRowActions
                id={expense.id}
                onDelete={() => handleDelete(expense.id)}
                disabled={isNewExpense}
              />
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ExpensesTable;
