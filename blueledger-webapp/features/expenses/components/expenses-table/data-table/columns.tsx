import { columnHeader } from '@/components/shared/data-table/sortable-column';
import { formatLocalizedDate } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { CircleEllipsis } from 'lucide-react';
import { CATEGORY_ICONS, ExpenseCategory } from '../../../constants';
import { ExpenseDisplay } from '../../../schemas';
import ExpenseActions from '../expense-actions';

// If using column reordering, make sure to specify the id of the column
export const columns: ColumnDef<ExpenseDisplay>[] = [
  {
    id: 'description',
    accessorKey: 'description',
    header: 'Description',
    enableHiding: false,
  },
  {
    id: 'category',
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
    id: 'date',
    accessorKey: 'date',
    header: columnHeader('Date'),
    cell: ({ row }) => {
      const date = row.original.date;
      return <div>{date ? formatLocalizedDate(date) : ''}</div>;
    },
  },
  {
    id: 'quantity',
    accessorKey: 'quantity',
    header: columnHeader('Quantity'),
  },
  {
    id: 'price',
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
    id: 'totalPrice',
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
          <ExpenseActions
            id={expense.optimisticId ?? expense.id!}
            disabled={!!expense.optimisticId}
            isCompact={true}
          />
        </div>
      );
    },
    enableHiding: false,
    enablePinning: true,
  },
];
