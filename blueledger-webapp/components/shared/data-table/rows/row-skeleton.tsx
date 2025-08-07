import type { ColumnDef } from '@tanstack/react-table';
import { Skeleton } from '@/components/ui/skeleton';
import { TableRow } from '@/components/ui/table';
import TableBodyCell from '../table-body-cell';

interface RowSkeletonProps<T> {
  id: string;
  columns: ColumnDef<T>[];
  rowHeight: number;
}

function RowSkeleton<T,>({ id, columns, rowHeight }: RowSkeletonProps<T>) {
  const fillerColumns = Array.from({ length: columns.length }, (_, idx) => ({
    stableKey: `empty-${idx}`,
    id: `empty-${idx}`,
  }));

  return (
    <TableRow key={id} style={{ height: `${rowHeight}px` }}>
      {fillerColumns.map(column => (
        <TableBodyCell key={column.stableKey} isPinned={false}>
          <Skeleton className="h-4" />
        </TableBodyCell>
      ))}

    </TableRow>
  );
}

export default RowSkeleton;
