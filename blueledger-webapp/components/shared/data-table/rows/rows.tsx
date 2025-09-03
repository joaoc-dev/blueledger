import type { Table } from '@tanstack/react-table';
import { TABLE_CONFIG } from '../constants';
import Row from './row';
import RowFullBodySkeleton from './row-full-body-skeleton';
import RowHidden from './row-hidden';

// Rendering of hidden row ensures that all column IDs remain registered in the SortableContext,
// which DnD-kit relies on to enable header drag-and-drop—even when no actual data rows are visible.
export function Rows<T,>({
  isLoading,
  table,
  overrideRowHeight,
}: {
  isLoading?: boolean;
  table: Table<T>;
  overrideRowHeight?: number;
}) {
  const tableRows = table.getRowModel().rows;

  // Table has fixed height, so we need to fill missing rows
  const emptyRows = TABLE_CONFIG.ROWS_PER_PAGE - tableRows.length;
  const rowHeight = overrideRowHeight ?? TABLE_CONFIG.ROW_HEIGHT;

  const visibleColumns = table.getHeaderGroups()
    .map(headerGroup => headerGroup.headers.map(header => header.column))
    .flat();

  if (isLoading) {
    return <RowFullBodySkeleton columns={visibleColumns} />;
  }

  const fillerRows = Array.from({ length: emptyRows }, (_, idx) => ({
    stableKey: `empty-${idx}`,
    id: `empty-${idx}`,
  }));

  return (
    <>
      {tableRows.map(row => (
        <Row<T> key={row.id} row={row} rowHeight={rowHeight} table={table} />
      ))}
      {fillerRows.map(row => (
        <RowHidden
          key={row.stableKey}
          id={row.id}
          table={table}
          rowHeight={rowHeight}
        />
      ))}
    </>
  );
}
