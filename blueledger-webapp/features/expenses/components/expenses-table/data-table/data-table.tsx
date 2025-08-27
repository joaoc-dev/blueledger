'use client';

import type {
  ColumnDef,
} from '@tanstack/react-table';
import type { ExpenseDisplay } from '../../../schemas';

import {
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import DraggableTable from '@/components/shared/data-table/draggable/draggable-table';
import { usePaginationWithUrl } from '@/components/shared/data-table/hooks/usePaginationWithUrl';
import { usePersistentTableState } from '@/components/shared/data-table/hooks/usePersistentTableState';
import { useSortingWithUrl } from '@/components/shared/data-table/hooks/useSortingWithUrl';
import { Pagination } from '@/components/shared/data-table/pagination';
import { EXPENSES_TABLE_CONFIG } from '../constants';
import { useColumnFiltersWithUrl } from '../hooks/useColumnFiltersWithUrl';
import { Toolbar } from '../toolbar';
import { columns } from './columns';

interface DataTableProps {
  data: ExpenseDisplay[];
  isLoading?: boolean;
  isFetching?: boolean;
}

export function DataTable({ data, isLoading, isFetching }: DataTableProps) {
  const defaultColumnOrder = columns.map(c => c.id!).filter(Boolean);

  const localStorageKeys = EXPENSES_TABLE_CONFIG.LOCAL_STORAGE_KEYS;

  const {
    state: { columnVisibility, columnOrder, columnSizing },
    handlers: { setColumnVisibility, setColumnOrder, setColumnSizing },
  } = usePersistentTableState({
    keys: {
      COLUMN_ORDER: localStorageKeys.COLUMN_ORDER,
      COLUMN_VISIBILITY: localStorageKeys.COLUMN_VISIBILITY,
      COLUMN_SIZES: localStorageKeys.COLUMN_SIZES,
    },
    defaultColumnOrder,
  });

  const [sorting, setSorting] = useSortingWithUrl('date', 'desc');
  const [pagination, setPagination] = usePaginationWithUrl();
  const [columnFilters, setColumnFilters] = useColumnFiltersWithUrl();

  const table = useReactTable({
    data,
    columns: columns as ColumnDef<ExpenseDisplay>[],
    defaultColumn: {
      minSize: 60,
    },
    initialState: {
      columnPinning: {
        right: ['filler', 'actions'],
      },
      // Set initial pagination state to prevent TanStack Table from overriding it
      pagination,
    },
    // Prevent automatic page resets when data changes
    autoResetPageIndex: false,
    state: {
      columnVisibility,
      sorting,
      columnFilters,
      columnOrder,
      columnSizing,
      pagination,
    },
    columnResizeMode: 'onChange',
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnOrderChange: setColumnOrder,
    onColumnFiltersChange: setColumnFilters,
    onColumnSizingChange: setColumnSizing,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-4">
      <Toolbar table={table} isFetching={isFetching} isLoading={isLoading} />

      <DraggableTable
        table={table}
        setColumnOrder={setColumnOrder}
        isLoading={isLoading}
        isFetching={isFetching}
        columns={columns as ColumnDef<ExpenseDisplay>[]}
      />

      <Pagination
        displaySelectedRows={false}
        enableRowsPerPage={false}
        table={table}
      />
    </div>
  );
}
