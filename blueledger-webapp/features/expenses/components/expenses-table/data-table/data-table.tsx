'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import DraggableTable from '@/components/shared/data-table/draggable/draggable-table';
import { usePersistentTableState } from '@/components/shared/data-table/hooks/usePersistentTableState';
import { Pagination } from '@/components/shared/data-table/pagination';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ExpenseDisplay } from '../../../schemas';
import { EXPENSES_TABLE_CONFIG } from '../constants';
import { Toolbar } from '../toolbar';
import { columns } from './columns';

interface DataTableProps {
  data: ExpenseDisplay[];
  isLoading?: boolean;
  isFetching?: boolean;
}

export function DataTable({ data, isLoading, isFetching }: DataTableProps) {
  const defaultColumnOrder = columns.map((c) => c.id!).filter(Boolean);

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

  // Move this to query params for sorting and filtering
  const [sorting, setSorting] = useLocalStorage<SortingState>(
    localStorageKeys.SORTING,
    []
  );

  const [columnFilters, setColumnFilters] = useLocalStorage<ColumnFiltersState>(
    localStorageKeys.COLUMN_FILTERS,
    []
  );

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
    },
    state: {
      columnVisibility,
      sorting,
      columnFilters,
      columnOrder,
      columnSizing,
    },
    columnResizeMode: 'onChange',
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

export default DataTable;
