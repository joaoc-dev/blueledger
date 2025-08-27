'use client';

import type {
  ColumnDef,
} from '@tanstack/react-table';
import type { ExpenseDisplay } from '@/features/expenses/schemas';

import {
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import Spinner from '@/components/shared/spinner';
import { columns } from '../data-table/columns';
import { useColumnFiltersWithUrl } from '../hooks/useColumnFiltersWithUrl';
import { Toolbar } from '../toolbar';
import { ListCard } from './list-card';

interface DataTableProps {
  data: ExpenseDisplay[];
  isLoading?: boolean;
  isFetching?: boolean;
}

export function StackedList({ data, isLoading, isFetching }: DataTableProps) {
  const [columnFilters, setColumnFilters] = useColumnFiltersWithUrl();

  const table = useReactTable({
    data,
    columns: columns as ColumnDef<ExpenseDisplay>[],
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const tableRows = table.getRowModel().rows;
  const hasData = tableRows.length > 0;
  const groupedExpenses = groupByDate(tableRows.map(row => row.original));

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Toolbar table={table} isFetching={isFetching} isLoading={isLoading} />
        <Spinner className="size-12 mx-auto mt-36" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Toolbar table={table} isFetching={isFetching} isLoading={isLoading} />

      <div className="flex flex-col gap-2 max-h-[calc(100vh-200px)] overflow-y-auto">
        {hasData
          ? (
              Object.entries(groupedExpenses).map(([date, expenses]) => (
                <div key={date} className="space-y-2 mb-6">
                  <h3 className="text-md font-semibold">{date}</h3>
                  {expenses.map(expense => (
                    <ListCard key={expense.id} expense={expense} />
                  ))}
                </div>
              ))
            )
          : (
              <div className="text-center text-sm text-muted-foreground">
                No results.
              </div>
            )}
      </div>
    </div>
  );
}

function groupByDate(expenses: ExpenseDisplay[]) {
  return expenses.reduce((acc, expense) => {
    const formattedDate = format(expense.date, 'EEEE, dd MMM yyyy');

    if (!acc[formattedDate])
      acc[formattedDate] = [];
    acc[formattedDate].push(expense);

    return acc;
  }, {} as Record<string, ExpenseDisplay[]>);
}
