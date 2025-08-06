import { TableRow } from '@/components/ui/table';
import { Table } from '@tanstack/react-table';
import { DraggableTableHead } from '../data-table/draggable/draggable-head';
import { TableHeaderCell } from '../data-table/table-header-cell';

interface HeadersProps<T> {
  table: Table<T>;
  columnRefs: React.RefObject<Map<string, HTMLTableCellElement>>;
  isLoading?: boolean;
  isFetching?: boolean;
}

export const Headers = <T,>({
  table,
  columnRefs,
  isLoading,
  isFetching,
}: HeadersProps<T>) => {
  const isResizing = !!table.getState().columnSizingInfo.isResizingColumn;

  return table.getHeaderGroups().map((headerGroup) => {
    return (
      <TableRow key={headerGroup.id} className="bg-muted/50">
        {headerGroup.headers.map((header) => {
          let isDraggable = !header.column.getIsPinned();
          isDraggable = isDraggable && !isLoading && !isFetching;

          const isFiller = header.column.id === 'filler';
          const isResizable = !isFiller && !header.column.getIsPinned();

          if (!isDraggable || isResizing || isFiller) {
            return (
              <TableHeaderCell<T>
                key={header.id}
                header={header}
                isReSizeable={isResizable}
                table={table}
              />
            );
          }

          return (
            <DraggableTableHead<T>
              key={header.id}
              header={header}
              columnRefs={columnRefs}
              table={table}
            />
          );
        })}
      </TableRow>
    );
  });
};
