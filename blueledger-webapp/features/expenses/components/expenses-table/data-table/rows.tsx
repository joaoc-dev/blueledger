import { TableCell, TableRow } from '@/components/ui/table';
import { ExpenseDisplay } from '@/features/expenses/schemas';
import { ColumnDef, flexRender, Table } from '@tanstack/react-table';
import Skeleton from '@/components/shared/skeleton';

export const Rows = ({
  isLoading,
  numRows,
  rowSize,
  columns,
  table,
}: {
  isLoading?: boolean;
  numRows: number;
  rowSize: number;
  columns: ColumnDef<ExpenseDisplay>[];
  table: Table<ExpenseDisplay>;
}) => {
  const tableRows = table.getRowModel().rows;
  const hasData = tableRows.length > 0;
  // Table has fixed height, so we need to fill missing rows
  const emptyRows = numRows - tableRows.length;

  if (isLoading) {
    return Array.from({ length: numRows }).map((_, id) => (
      <TableRow key={id} style={{ height: `${rowSize}px` }}>
        {columns.map((_, j) => (
          <TableCell key={`${id}-${j}`}>
            <Skeleton className="h-4 w-full rounded bg-muted animate-pulse" />
          </TableCell>
        ))}
      </TableRow>
    ));
  }

  if (!hasData) {
    return (
      <TableRow>
        <TableCell colSpan={columns.length} className="text-center">
          No results.
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {tableRows.map((row) => (
        <TableRow key={row.id} style={{ height: `${rowSize}px` }}>
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))}
      {Array.from({ length: emptyRows }).map((_, id) => (
        <TableRow key={id} style={{ height: `${rowSize}px` }} />
      ))}
    </>
  );
};
