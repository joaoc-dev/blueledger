'use client';

import type { ColumnDef, Table as TableType } from '@tanstack/react-table';
import type { Dispatch, SetStateAction } from 'react';
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  horizontalListSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';
import { useRef } from 'react';
import { useDrag } from '../hooks/useDrag';
import TableElement from '../table-element';
import ColumnDragOverlay from './header-drag-overlay';

interface DraggableTableProps<T> {
  table: TableType<T>;
  setColumnOrder: Dispatch<SetStateAction<string[]>>;
  isLoading?: boolean;
  isFetching?: boolean;
  columns: ColumnDef<T>[];
}

function DraggableTable<T,>({
  table,
  setColumnOrder,
  isLoading,
  isFetching,
  columns,
}: DraggableTableProps<T>) {
  const isResizing = !!table.getState().columnSizingInfo.isResizingColumn;

  // Store a ref to the column cells so we can get their bounding client rect
  // This is used to control the position of the drag overlay
  const columnRefs = useRef<Map<string, HTMLTableCellElement>>(new Map());
  const { handleDragStart, handleDragEnd, activeColumnId, draggedElementRect }
    = useDrag({ setColumnOrder, columnRefs, isResizing });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
  );

  const sortableHeaderIds = table
    .getHeaderGroups()
    .flatMap(headerGroup =>
      headerGroup.headers
        .filter(header => !header.column.getIsPinned())
        .map(header => header.column.id),
    );

  // Force remount SortableContext when column sizing changes
  // to fix drag misalignment after column resize
  const sortableContextKey = isResizing
    ? 'resizing' // Use stable key during resize to prevent infinite loop
    : JSON.stringify(sortableHeaderIds)
      + JSON.stringify(table.getState().columnSizing);

  const tableProps = {
    table,
    isLoading,
    isFetching,
    columnRefs,
  };

  return isResizing
    ? (
        <TableElement {...tableProps} />
      )
    : (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
          sensors={sensors}
        >
          <SortableContext
            key={sortableContextKey}
            items={sortableHeaderIds}
            strategy={horizontalListSortingStrategy}
          >
            <TableElement {...tableProps} />
          </SortableContext>

          <ColumnDragOverlay
            activeColumnId={activeColumnId}
            columns={columns}
            draggedElementRect={draggedElementRect}
          />
        </DndContext>
      );
}

export default DraggableTable;
