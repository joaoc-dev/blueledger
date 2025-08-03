import Skeleton from '@/components/shared/skeleton';
import { TableRow } from '@/components/ui/table';
import { ColumnDef } from '@tanstack/react-table';
import TableBodyCell from '../table-body-cell';

interface RowSkeletonProps<T> {
  id: string;
  columns: ColumnDef<T>[];
  rowHeight: number;
}

const RowSkeleton = <T,>({ id, columns, rowHeight }: RowSkeletonProps<T>) => {
  return (
    <TableRow key={id} style={{ height: `${rowHeight}px` }}>
      {columns.map((_, j) => (
        <TableBodyCell key={`${id}-${j}`} isPinned={false}>
          <Skeleton className="h-4 w-full rounded bg-muted animate-pulse" />
        </TableBodyCell>
      ))}
    </TableRow>
  );
};

export default RowSkeleton;
