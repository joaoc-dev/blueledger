import { Badge } from '@/components/ui/badge';
import { DragOverlay } from '@dnd-kit/core';
import { ColumnDef } from '@tanstack/react-table';
import { Move } from 'lucide-react';

interface ColumnDragOverlayProps<T> {
  activeColumnId: string | null;
  columns: ColumnDef<T, unknown>[];
  draggedElementRect: DOMRect | null;
}

// We share IDs between cells and headers so the drag preview reflects the dragged column.
// However, DragOverlay uses the last rendered element matching the active ID, which is the last row's cell,
// causing the overlay to appear at the bottom of the table.
// One known workaround is to render <TableHeader> after <TableBody>, as discussed here:
// https://github.com/clauderic/dnd-kit/discussions/1401
// But that may cause accessibility issues or break other expectations.
// Our current workaround offsets the overlay with a CSS translate, which is brittle.
// Ideally, we should find a more robust solution.
const ColumnDragOverlay = <T,>({
  activeColumnId,
  columns,
  draggedElementRect,
}: ColumnDragOverlayProps<T>) => {
  const activeColumn = columns.find((c) => c.id === activeColumnId);
  const headerText =
    typeof activeColumn?.header === 'string'
      ? activeColumn.header
      : activeColumn?.id;

  return (
    <DragOverlay
      style={{
        position: 'absolute',
        top: draggedElementRect?.top,
        left: draggedElementRect?.left,
        width: draggedElementRect?.width,
        height: draggedElementRect?.height,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
      dropAnimation={null}
    >
      {activeColumnId ? (
        <Badge
          variant="outline"
          style={{
            cursor: 'grabbing',
            pointerEvents: 'auto',
          }}
          className="h-12 px-4 bg-muted/90 flex items-center gap-3 text-md font-medium cursor-grabbing select-none justify-start shadow-xl"
        >
          <span className="flex items-center justify-center">
            <Move className="w-4 h-4" />
          </span>
          {headerText || activeColumnId}
        </Badge>
      ) : null}
    </DragOverlay>
  );
};

export default ColumnDragOverlay;
