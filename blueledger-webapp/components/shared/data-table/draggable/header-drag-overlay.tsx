import { Badge } from '@/components/ui/badge';
import { DragOverlay } from '@dnd-kit/core';
import { ColumnDef } from '@tanstack/react-table';
import { Move } from 'lucide-react';

interface ColumnDragOverlayProps<T> {
  activeColumnId: string | null;
  columns: ColumnDef<T, unknown>[];
  draggedElementRect: DOMRect | null;
}

// Note: @dnd-kit DragOverlay normally clones the dragged element based on active ID,
// but since header and body cells share IDs, it often picks the wrong element (last row's cell),
// causing the overlay to appear at the bottom of the table.
//
// Instead of relying on the default cloning, we manually position the overlay using
// the draggedElementRect DOMRect for accurate placement.
//
// This approach avoids the known rendering issues but relies on accurate measurement
// and can be brittle if layout changes during drag.
// Ideally, a more robust solution that avoids ID conflicts or improves DragOverlay behavior
// would be preferred.
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
