import type { DraggableAttributes } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import type { Header, Table } from '@tanstack/react-table';
import type { CSSProperties } from 'react';
import { flexRender } from '@tanstack/react-table';
import { TableHead } from '@/components/ui/table';
import { getCommonPinningStyles } from './utils';

interface TableHeaderCellProps<T> {
  header: Header<T, unknown>;
  isReSizeable?: boolean;
  style?: CSSProperties;
  dragProps?: {
    attributes: DraggableAttributes;
    listeners?: SyntheticListenerMap;
    setNodeRef: (node: HTMLTableCellElement | null) => void;
  };
  table: Table<T>;
}

export function TableHeaderCell<T,>({
  header,
  isReSizeable,
  style,
  dragProps,
  table,
}: TableHeaderCellProps<T>) {
  const isFiller = header.column.id === 'filler';
  const width = isFiller
    ? 'auto'
    : `calc(var(--header-${header?.id}-size) * 1px)`;

  return (
    <TableHead
      key={header.id}
      colSpan={header.colSpan}
      className="relative truncate bg-muted"
      style={{
        ...style,
        whiteSpace: 'nowrap',
        width,
        ...getCommonPinningStyles({ column: header.column, table }),
      }}
      ref={dragProps?.setNodeRef}
      {...dragProps?.attributes}
      {...dragProps?.listeners}
    >
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.header, header.getContext())}

      {isReSizeable && (
        <div
          title="Drag to resize, double-click to reset"
          role="separator"
          aria-orientation="vertical"
          onDoubleClick={() => header.column.resetSize()}
          onMouseDown={(event) => {
            // Only start resize if it's not a double-click
            if (event.detail === 1) {
              header.getResizeHandler()(event);
            }
          }}
          onTouchStart={(event) => {
            header.getResizeHandler()(event);
          }}
          className="mr-2 cursor-col-resize bg-primary/30 absolute right-0 top-1/4 h-2/4 w-1"
        />
      )}
    </TableHead>
  );
}
