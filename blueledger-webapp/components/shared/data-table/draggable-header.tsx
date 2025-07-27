import { CSSProperties } from 'react';
import { Header } from '@tanstack/react-table';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TableHead } from '@/components/ui/table';
import { flexRender } from '@tanstack/react-table';

interface DraggableTableHeaderProps<T> {
  header: Header<T, unknown>;
  columnRefs: React.RefObject<Map<string, HTMLTableCellElement>>;
}

export const DraggableTableHeader = <T,>({
  header,
  columnRefs,
}: DraggableTableHeaderProps<T>) => {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      id: header.column.id,
    });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: 'relative',
    transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
    transition: transform ? 'transform 250ms ease' : undefined,
    whiteSpace: 'nowrap',
    zIndex: isDragging ? 1 : 0,
    cursor: 'grab',
  };

  return (
    <TableHead
      key={header.id}
      colSpan={header.colSpan}
      ref={(node) => {
        setNodeRef(node);

        if (node) {
          columnRefs.current.set(header.column.id, node);
        } else {
          columnRefs.current.delete(header.column.id);
        }
      }}
      style={style}
      {...attributes}
      {...listeners}
    >
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.header, header.getContext())}
    </TableHead>
  );
};
