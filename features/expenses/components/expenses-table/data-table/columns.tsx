import type { ColumnDef } from '@tanstack/react-table';
import type { ExpenseDisplay } from '../../../schemas';
import { columnHeader } from '@/components/shared/data-table/sortable-column';
import NumericDisplay from '@/components/shared/numeric-display';
import { formatLocalizedDate } from '@/lib/utils';
import ExpenseActions from '../expense-actions';
import { CategoryCell } from './category-cell';

// If using column reordering, make sure to specify the id of the column
export const columns: ColumnDef<ExpenseDisplay>[] = [
  {
    id: 'description',
    accessorKey: 'description',
    header: 'Description',
    size: 300,
    enableHiding: false,
  },
  {
    id: 'category',
    accessorKey: 'category',
    header: 'Category',
    size: 150,
    cell: CategoryCell,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'date',
    accessorKey: 'date',
    header: columnHeader('Date'),
    size: 130,
    cell: ({ row }) => {
      const date = row.original.date;
      return (
        <div className="truncate">{date ? formatLocalizedDate(date) : ''}</div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      if (!value)
        return false;

      const date = new Date(value as string | Date).getTime();

      const from = filterValue?.from
        ? new Date(filterValue.from).getTime()
        : null;
      const to = filterValue?.to ? new Date(filterValue.to).getTime() : null;

      if (from && to)
        return date >= from && date <= to;
      if (from)
        return date >= from;
      if (to)
        return date <= to;

      return true;
    },
  },
  {
    id: 'quantity',
    accessorKey: 'quantity',
    header: columnHeader('Quantity'),
    size: 100,
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue('quantity'));
      return <NumericDisplay value={amount} maximumFractionDigits={2} />;
    },
  },
  {
    id: 'price',
    accessorKey: 'price',
    header: 'Price',
    size: 100,
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue('price'));
      return <NumericDisplay value={amount} format="currency" maximumFractionDigits={2} />;
    },
  },
  {
    id: 'totalPrice',
    accessorKey: 'totalPrice',
    header: 'Total Price',
    size: 120,
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue('totalPrice'));
      return <NumericDisplay value={amount} format="currency" maximumFractionDigits={2} />;
    },
  },
  {
    id: 'filler',
    header: () => null,
    cell: () => null,
    minSize: 0,
    enableHiding: false,
    enableResizing: false,
    enablePinning: true,
    meta: {
      isFiller: true,
    },
  },
  {
    id: 'actions',
    size: 110,
    maxSize: 110,
    cell: ({ row }) => {
      const expense = row.original;

      return (
        <div className="flex justify-center gap-1">
          <ExpenseActions
            id={expense.optimisticId ?? expense.id!}
            disabled={!!expense.optimisticId}
            isCompact={true}
          />
        </div>
      );
    },
    enableHiding: false,
    enableResizing: false,
    enablePinning: true,
    enableSorting: false,
  },
];
