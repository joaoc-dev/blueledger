import { ExpenseDisplay } from '@/features/expenses/schemas';
import { ColumnDef, Table } from '@tanstack/react-table';
import Row from './row';
import RowHidden from './row-hidden';
import RowSkeleton from './row-skeleton';
import { TABLE_CONFIG } from '../../constants';

// This hidden row ensures that all column IDs remain registered in the SortableContext,
// which DnD-kit relies on to enable header drag-and-drop—even when no actual data rows are visible.
export const Rows = ({
  isLoading,
  columns,
  table,
  sortableHeaderIds,
}: {
  isLoading?: boolean;
  columns: ColumnDef<ExpenseDisplay>[];
  table: Table<ExpenseDisplay>;
  sortableHeaderIds: string[];
}) => {
  const tableRows = table.getRowModel().rows;

  // Table has fixed height, so we need to fill missing rows
  const emptyRows = TABLE_CONFIG.DEFAULT_ROWS - tableRows.length;

  if (isLoading) {
    return Array.from({ length: TABLE_CONFIG.DEFAULT_ROWS }).map((_, id) => (
      <RowSkeleton id={id.toString()} columns={columns} />
    ));
  }

  return (
    <>
      {tableRows.map((row) => (
        <Row key={row.id} row={row} />
      ))}
      {Array.from({ length: emptyRows }).map((_, id) => (
        <RowHidden
          key={id}
          id={id.toString()}
          sortableHeaderIds={sortableHeaderIds}
        />
      ))}
    </>
  );
};
