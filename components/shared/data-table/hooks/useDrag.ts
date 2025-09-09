import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import type { Dispatch, SetStateAction } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import posthog from 'posthog-js';
import { useState } from 'react';
import { AnalyticsEvents } from '@/constants/analytics-events';

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
    null,
  );

  function handleDragStart(event: DragStartEvent) {
    if (isResizing)
      return;

    setActiveColumnId(event.active.id as string);
    posthog.capture(AnalyticsEvents.TABLE_COLUMN_DRAG_START, { column: event.active.id });

    const cell = columnRefs.current.get(event.active.id as string);
    if (cell) {
      setDraggedElementRect(cell.getBoundingClientRect());
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveColumnId(null);
    setDraggedElementRect(null);

    const { active, over } = event;
    if (!over || active.id === over.id)
      return;

    setColumnOrder((prev) => {
      if (
        !prev.includes(active.id as string)
        || !prev.includes(over.id as string)
      ) {
        return prev; // prevent corrupting state
      }

      const oldIndex = prev.indexOf(active.id as string);
      const newIndex = prev.indexOf(over.id as string);

      if (oldIndex === newIndex)
        return prev;

      posthog.capture(AnalyticsEvents.TABLE_COLUMN_DRAG_END, {
        from: active.id,
        to: over.id,
      });
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
