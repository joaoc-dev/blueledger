import Skeleton from '@/components/shared/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';
import { ExpenseDisplay } from '@/features/expenses/schemas';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { TABLE_CONFIG } from '../../constants';

interface RowSkeletonProps {
  id: string;
  columns: ColumnDef<ExpenseDisplay>[];
}

const RowSkeleton = ({ id, columns }: RowSkeletonProps) => {
  return (
    <TableRow key={id} style={{ height: `${TABLE_CONFIG.ROW_SIZE}px` }}>
      {columns.map((_, j) => (
        <TableCell key={`${id}-${j}`}>
          <Skeleton className="h-4 w-full rounded bg-muted animate-pulse" />
        </TableCell>
      ))}
    </TableRow>
  );
};

export default RowSkeleton;
