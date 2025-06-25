'use client';

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
import { Button } from '../../ui/button';
import { getQueryClient } from '@/lib/react-query/get-query-client';
import { DataTable } from '../../shared/data-table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { ExpenseType } from '@/types/expense';

const ClientGetExpenses = async () => {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const expenses = await getExpenses();
  // console.log('ClientGetExpenses', expenses);
  return expenses;
};

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

const columns: ColumnDef<ExpenseType>[] = [
  {
    accessorKey: 'description',
    header: 'Description',
    enableHiding: false,
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const category = row.original.category;
      const Icon =
        category && category in CATEGORY_ICONS
          ? CATEGORY_ICONS[category as ExpenseCategory]
          : CircleEllipsis;

      return (
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {category ? category : 'Other'}
        </div>
      );
    },
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      const date = row.original.date;
      return <div>{date ? formatLocalizedDate(date) : ''}</div>;
    },
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
  },

  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('price'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR',
      }).format(amount);
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: 'totalPrice',
    header: 'Total Price',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('totalPrice'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR',
      }).format(amount);
      return <div>{formatted}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const expense = row.original;

      return (
        <div className="flex justify-end">
          <ExpenseRowActions
            id={expense.id}
            onDelete={() => handleDelete(expense.id)}
            disabled={!!expense.optimisticId}
          />
        </div>
      );
    },
    enableHiding: false,
  },
];

const ExpensesTable = () => {
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
    <DataTable
      storageKey="expenses.visibleColumns"
      columns={columns}
      data={expenses || []}
    />
  );
};

export default ExpensesTable;
