import { TableRow } from '@/components/ui/table';
import {
  flexRender,
  Row as RowType,
  Table as TableType,
} from '@tanstack/react-table';
import { DragAlongCell } from '../draggable/drag-along-cell';
import TableBodyCell from '../table-body-cell';
import { getCommonPinningStyles } from '../utils';

interface RowProps<T> {
  row: RowType<T>;
  rowHeight: number;
  table: TableType<T>;
}

const Row = <T,>({ row, rowHeight, table }: RowProps<T>) => {
  return (
    <TableRow key={row.id} style={{ height: `${rowHeight}px` }}>
      {row.getVisibleCells().map((cell) =>
        cell.column.getIsPinned() ? (
          <TableBodyCell
            key={cell.id}
            columnId={cell.column.id}
            isPinned={!!cell.column.getIsPinned()}
            style={{
              ...getCommonPinningStyles({ column: cell.column, table }),
            }}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableBodyCell>
        ) : (
          <DragAlongCell
            key={cell.id}
            columnId={cell.column.id}
            style={{
              ...getCommonPinningStyles({
                column: cell.column,
                table,
              }),
            }}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </DragAlongCell>
        )
      )}
    </TableRow>
  );
};

export default Row;
