import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Dispatch, SetStateAction, useState } from 'react';

interface UseDragProps {
  setColumnOrder: Dispatch<SetStateAction<string[]>>;
  columnRefs: React.RefObject<Map<string, HTMLTableCellElement>>;
  isResizing: boolean;
}

export function useDrag({
  setColumnOrder,
  columnRefs,
  isResizing,
}: UseDragProps) {
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [draggedElementRect, setDraggedElementRect] = useState<DOMRect | null>(
    null
  );

  function handleDragStart(event: DragStartEvent) {
    if (isResizing) return;

    setActiveColumnId(event.active.id as string);

    const cell = columnRefs.current.get(event.active.id as string);
    if (cell) {
      setDraggedElementRect(cell.getBoundingClientRect());
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveColumnId(null);
    setDraggedElementRect(null);

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setColumnOrder((prev) => {
      if (
        !prev.includes(active.id as string) ||
        !prev.includes(over.id as string)
      ) {
        return prev; // prevent corrupting state
      }

      const oldIndex = prev.indexOf(active.id as string);
      const newIndex = prev.indexOf(over.id as string);

      if (oldIndex === newIndex) return prev;

      return arrayMove(prev, oldIndex, newIndex);
    });
  }

  return {
    handleDragStart,
    handleDragEnd,
    activeColumnId,
    draggedElementRect,
  };
}
