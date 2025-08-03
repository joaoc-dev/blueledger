import { ColumnDef, Table } from '@tanstack/react-table';
import { TABLE_CONFIG } from '../constants';
import Row from './row';
import RowHidden from './row-hidden';
import RowSkeleton from './row-skeleton';

// Rendering of hidden row ensures that all column IDs remain registered in the SortableContext,
// which DnD-kit relies on to enable header drag-and-drop—even when no actual data rows are visible.
export const Rows = <T,>({
  isLoading,
  columns,
  table,
  overrideRowHeight,
}: {
  isLoading?: boolean;
  columns: ColumnDef<T>[];
  table: Table<T>;
  overrideRowHeight?: number;
}) => {
  const tableRows = table.getRowModel().rows;

  // Table has fixed height, so we need to fill missing rows
  const emptyRows = TABLE_CONFIG.ROWS_PER_PAGE - tableRows.length;
  const rowHeight = overrideRowHeight ?? TABLE_CONFIG.ROW_HEIGHT;

  if (isLoading) {
    return (
      <>
        {Array.from({ length: TABLE_CONFIG.ROWS_PER_PAGE }).map((_, id) => (
          <RowSkeleton
            key={id.toString()}
            id={id.toString()}
            columns={columns}
            rowHeight={rowHeight}
          />
        ))}
      </>
    );
  }

  return (
    <>
      {tableRows.map((row) => (
        <Row<T> key={row.id} row={row} rowHeight={rowHeight} table={table} />
      ))}
      {Array.from({ length: emptyRows }).map((_, id) => (
        <RowHidden
          key={id.toString()}
          id={id.toString()}
          table={table}
          rowHeight={rowHeight}
        />
      ))}
    </>
  );
};
