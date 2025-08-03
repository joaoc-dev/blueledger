import { TableRow } from '@/components/ui/table';
import { Table } from '@tanstack/react-table';
import TableBodyCell from '../table-body-cell';
import { getCommonPinningStyles } from '../utils';

interface RowHiddenProps<T> {
  id: string;
  table: Table<T>;
  rowHeight: number;
}

const RowHidden = <T,>({ id, table, rowHeight }: RowHiddenProps<T>) => {
  const visibleColumns = table.getVisibleFlatColumns();

  return (
    <TableRow key={id} style={{ height: `${rowHeight}px` }}>
      {visibleColumns.map((column) => (
        <TableBodyCell
          key={column.id}
          columnId={column.id}
          isPinned={!!column.getIsPinned()}
          style={getCommonPinningStyles({ column, table })}
        >
          {''}
        </TableBodyCell>
      ))}
    </TableRow>
  );
};

export default RowHidden;
