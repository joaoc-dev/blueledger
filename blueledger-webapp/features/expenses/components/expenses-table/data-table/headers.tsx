import { DraggableTableHeader } from '@/components/shared/data-table/draggable-header';
import { TableHead, TableRow } from '@/components/ui/table';
import { flexRender, Table } from '@tanstack/react-table';
import { ExpenseDisplay } from '../../../schemas';

interface HeadersProps {
  table: Table<ExpenseDisplay>;
  columnRefs: React.RefObject<Map<string, HTMLTableCellElement>>;
  isLoading?: boolean;
  isFetching?: boolean;
}

export const Headers = ({
  table,
  columnRefs,
  isLoading,
  isFetching,
}: HeadersProps) => {
  return table.getHeaderGroups().map((headerGroup) => {
    return (
      <TableRow key={headerGroup.id} className="bg-muted/50">
        {headerGroup.headers.map((header) => {
          let isDraggable = !header.column.getIsPinned();
          isDraggable = isDraggable && !isLoading && !isFetching;

          if (!isDraggable) {
            return (
              <TableHead
                key={header.id}
                colSpan={header.colSpan}
                style={{ whiteSpace: 'nowrap' }}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            );
          }

          return (
            <DraggableTableHeader<ExpenseDisplay>
              key={header.id}
              header={header}
              columnRefs={columnRefs}
            />
          );
        })}
      </TableRow>
    );
  });
};
