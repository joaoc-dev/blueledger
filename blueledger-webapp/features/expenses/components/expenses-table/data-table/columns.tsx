import { columnHeader } from '@/components/shared/data-table/sortable-column';
import { formatLocalizedDate } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { ExpenseDisplay } from '../../../schemas';
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
  },
  {
    id: 'quantity',
    accessorKey: 'quantity',
    header: columnHeader('Quantity'),
    size: 100,
  },
  {
    id: 'price',
    accessorKey: 'price',
    header: 'Price',
    size: 100,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('price'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR',
      }).format(amount);
      return <div className="truncate">{formatted}</div>;
    },
  },
  {
    id: 'totalPrice',
    accessorKey: 'totalPrice',
    header: 'Total Price',
    size: 120,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('totalPrice'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR',
      }).format(amount);
      return <div className="truncate">{formatted}</div>;
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
    size: 100,
    maxSize: 100,
    cell: ({ row }) => {
      const expense = row.original;

      return (
        <div className="flex justify-end">
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
  },
];
