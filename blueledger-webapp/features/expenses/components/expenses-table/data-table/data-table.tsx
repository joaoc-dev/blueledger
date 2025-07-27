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

import { Pagination } from '@/components/shared/data-table/pagination';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ExpenseDisplay } from '../../../schemas';
import { TABLE_CONFIG } from '../constants';
import { Toolbar } from '../toolbar';
import { columns } from './columns';
import DraggableTable from './draggable-table';

interface DataTableProps {
  data: ExpenseDisplay[];
  isLoading?: boolean;
  isFetching?: boolean;
}

export function DataTable({ data, isLoading, isFetching }: DataTableProps) {
  const defaultColumnOrder = columns.map((c) => c.id!).filter(Boolean);
  const [columnOrder, setColumnOrder] = useLocalStorage<string[]>(
    TABLE_CONFIG.LOCAL_STORAGE_KEYS.COLUMN_ORDER,
    defaultColumnOrder
  );

  const [columnVisibility, setColumnVisibility] = useLocalStorage<
    Record<string, boolean>
  >(TABLE_CONFIG.LOCAL_STORAGE_KEYS.COLUMN_VISIBILITY, {});

  // use query params for sorting and filtering
  const [sorting, setSorting] = useLocalStorage<SortingState>(
    TABLE_CONFIG.LOCAL_STORAGE_KEYS.SORTING,
    []
  );

  const [columnFilters, setColumnFilters] = useLocalStorage<ColumnFiltersState>(
    TABLE_CONFIG.LOCAL_STORAGE_KEYS.COLUMN_FILTERS,
    []
  );

  const table = useReactTable({
    data,
    columns: columns as ColumnDef<ExpenseDisplay>[],
    initialState: {
      columnPinning: {
        right: ['actions'],
      },
    },
    state: {
      columnVisibility,
      sorting,
      columnFilters,
      columnOrder,
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnOrderChange: setColumnOrder,
    onColumnFiltersChange: setColumnFilters,
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
