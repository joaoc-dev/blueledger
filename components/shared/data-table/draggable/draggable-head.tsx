'use client';

import type { Header, Table } from '@tanstack/react-table';
import type { CSSProperties } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TableHeaderCell } from '../table-header-cell';

interface DraggableTableHeaderProps<T> {
  header: Header<T, unknown>;
  columnRefs: React.RefObject<Map<string, HTMLTableCellElement>>;
  table: Table<T>;
}

export function DraggableTableHead<T,>({
  header,
  columnRefs,
  table,
}: DraggableTableHeaderProps<T>) {
  const { attributes, isDragging, listeners, setNodeRef, transform }
    = useSortable({
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

  const handleSetNodeRef = (node: HTMLTableCellElement | null) => {
    setNodeRef(node);

    if (node) {
      columnRefs.current.set(header.column.id, node);
    }
    else {
      columnRefs.current.delete(header.column.id);
    }
  };

  return (
    <TableHeaderCell
      header={header}
      isReSizeable={true}
      style={style}
      dragProps={{ attributes, listeners, setNodeRef: handleSetNodeRef }}
      table={table}
    />
  );
}
