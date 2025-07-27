import { DragAlongCell } from '@/components/shared/data-table/drag-along-cell';
import { TableCell, TableRow } from '@/components/ui/table';
import { flexRender } from '@tanstack/react-table';
import { ExpenseDisplay } from '@/features/expenses/schemas';
import { Row as RowType } from '@tanstack/react-table';
import { TABLE_CONFIG } from '../../constants';

interface RowProps {
  row: RowType<ExpenseDisplay>;
}

const Row = ({ row }: RowProps) => {
  return (
    <TableRow key={row.id} style={{ height: `${TABLE_CONFIG.ROW_SIZE}px` }}>
      {row.getVisibleCells().map((cell) =>
        cell.column.getIsPinned() ? (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ) : (
          <DragAlongCell key={cell.id} columnId={cell.column.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </DragAlongCell>
        )
      )}
    </TableRow>
  );
};

export default Row;
