import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CSSProperties } from 'react';
import TableBodyCell from '../table-body-cell';

export function DragAlongCell({
  columnId,
  children,
  style,
}: {
  columnId: string;
  children: React.ReactNode;
  style?: CSSProperties;
}) {
  const { setNodeRef, transform, isDragging } = useSortable({ id: columnId });

  const draggingStyle: CSSProperties = {
    opacity: isDragging ? 0.6 : 1,
    transform: CSS.Translate.toString(transform),
    transition: transform ? 'transform 250ms ease' : undefined,
    ...style,
  };

  return (
    <TableBodyCell
      columnId={columnId}
      isPinned={false}
      ref={setNodeRef}
      style={draggingStyle}
      className="truncate"
    >
      {children}
    </TableBodyCell>
  );
}
