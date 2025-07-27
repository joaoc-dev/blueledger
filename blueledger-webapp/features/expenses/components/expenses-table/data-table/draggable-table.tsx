import ColumnDragOverlay from '@/components/shared/data-table/header-drag-overlay';
import { Table, TableBody, TableHeader } from '@/components/ui/table';
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
import { Table as TableType } from '@tanstack/react-table';
import { Dispatch, SetStateAction, useRef } from 'react';
import { ExpenseDisplay } from '../../../schemas';
import { TABLE_CONFIG } from '../constants';
import { useDrag } from '../hooks';
import { columns } from './columns';
import { Headers } from './headers';
import { Rows } from './rows';

interface DraggableTableProps {
  table: TableType<ExpenseDisplay>;
  setColumnOrder: Dispatch<SetStateAction<string[]>>;
  isLoading?: boolean;
  isFetching?: boolean;
}

const DraggableTable = ({
  table,
  setColumnOrder,
  isLoading,
  isFetching,
}: DraggableTableProps) => {
  const columnRefs = useRef<Map<string, HTMLTableCellElement>>(new Map());

  const { handleDragStart, handleDragEnd, activeColumnId, draggedElementRect } =
    useDrag({ setColumnOrder, columnRefs });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    })
  );

  const sortableHeaderIds = table
    .getHeaderGroups()
    .flatMap((headerGroup) =>
      headerGroup.headers
        .filter((header) => !header.column.getIsPinned())
        .map((header) => header.column.id)
    );

  const totalHeight = TABLE_CONFIG.DEFAULT_ROWS * TABLE_CONFIG.ROW_SIZE;

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <div className="rounded-md border">
        <Table>
          <SortableContext
            items={sortableHeaderIds}
            strategy={horizontalListSortingStrategy}
          >
            <TableHeader>
              <Headers
                table={table}
                columnRefs={columnRefs}
                isLoading={isLoading}
                isFetching={isFetching}
              />
            </TableHeader>
            <TableBody style={{ height: `${totalHeight}px` }}>
              <Rows
                isLoading={isLoading}
                columns={columns}
                table={table}
                sortableHeaderIds={sortableHeaderIds}
              />
            </TableBody>
          </SortableContext>
        </Table>
      </div>

      <ColumnDragOverlay
        activeColumnId={activeColumnId}
        columns={columns}
        draggedElementRect={draggedElementRect}
      />
    </DndContext>
  );
};

export default DraggableTable;
