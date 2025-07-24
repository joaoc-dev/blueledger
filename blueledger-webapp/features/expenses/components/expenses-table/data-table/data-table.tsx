'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Pagination } from '@/components/shared/data-table/pagination';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ExpenseDisplay } from '../../../schemas';
import { columns } from './columns';
import { Rows } from './rows';
import { Toolbar } from './toolbar';

interface DataTableProps {
  data: ExpenseDisplay[];
  isLoading?: boolean;
  isFetching?: boolean;
}

export function DataTable({ data, isLoading, isFetching }: DataTableProps) {
  const [columnVisibility, setColumnVisibility] = useLocalStorage<
    Record<string, boolean>
  >(`expenses.columnVisibility`, {});

  const [sorting, setSorting] = useLocalStorage<SortingState>(
    `expenses.sorting`,
    []
  );

  const [columnFilters, setColumnFilters] = useLocalStorage<ColumnFiltersState>(
    `expenses.columnFilters`,
    []
  );

  const table = useReactTable({
    data,
    columns: columns as ColumnDef<ExpenseDisplay>[],
    state: {
      columnVisibility,
      sorting,
      columnFilters,
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const numRows = 10;
  const rowSize = 56;
  const totalHeight = numRows * rowSize;

  return (
    <div className="space-y-4">
      <Toolbar table={table} isFetching={isFetching} isLoading={isLoading} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody style={{ height: `${totalHeight}px` }}>
            <Rows
              isLoading={isLoading}
              numRows={numRows}
              rowSize={rowSize}
              columns={columns}
              table={table}
            />
          </TableBody>
        </Table>
      </div>
      <Pagination
        displaySelectedRows={false}
        enableRowsPerPage={false}
        table={table}
      />
    </div>
  );
}

export default DataTable;
