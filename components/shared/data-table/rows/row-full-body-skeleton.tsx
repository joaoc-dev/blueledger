import type { ColumnDef } from '@tanstack/react-table';
import { TableRow } from '@/components/ui/table';
import Spinner from '../../spinner';
import TableBodyCell from '../table-body-cell';

function RowFullBodySkeleton({ columns }: { columns: ColumnDef<any>[] }) {
  return (
    <TableRow className="relative">
      {columns.map((col, idx) => (
        <TableBodyCell key={col.id ?? idx} isPinned={false}>
          {idx === 0 && (
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{ zIndex: 1 }}
            >
              <Spinner className="size-12" />
            </div>
          )}
        </TableBodyCell>
      ))}
    </TableRow>
  );
}

export default RowFullBodySkeleton;
