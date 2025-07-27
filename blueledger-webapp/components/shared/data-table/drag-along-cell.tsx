import { TableCell } from '@/components/ui/table';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CSSProperties } from 'react';

export function DragAlongCell({
  columnId,
  children,
}: {
  columnId: string;
  children: React.ReactNode;
}) {
  const { setNodeRef, transform, isDragging } = useSortable({ id: columnId });

  const style: CSSProperties = {
    opacity: isDragging ? 0.6 : 1,
    transform: CSS.Translate.toString(transform),
    transition: transform ? 'transform 250ms ease' : undefined,
  };

  return (
    <TableCell ref={setNodeRef} style={style}>
      {children}
    </TableCell>
  );
}
