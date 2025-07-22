import { DataTableColumnHeader } from '@/components/shared/data-table/data-table-column-header';
import { formatLocalizedDate } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { CircleEllipsis } from 'lucide-react';
import { CATEGORY_ICONS, ExpenseCategory } from '../../constants';
import { ExpenseDisplay } from '../../schemas';
import ExpenseRowActions from './expense-row-actions';

export const columns: ColumnDef<ExpenseDisplay>[] = [
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
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
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
            id={expense.optimisticId ?? expense.id!}
            disabled={!!expense.optimisticId}
          />
        </div>
      );
    },
    enableHiding: false,
  },
];
