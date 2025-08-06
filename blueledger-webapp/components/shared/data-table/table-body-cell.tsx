import { TableCell } from '@/components/ui/table';
import React from 'react';

interface TableBodyCellProps {
  children: React.ReactNode;
  isPinned: boolean;
  columnId?: string;
  style?: React.CSSProperties;
  className?: string;
  colSpan?: number;
}

const TableBodyCell = React.forwardRef<
  HTMLTableCellElement,
  TableBodyCellProps
>(({ children, style, columnId, isPinned, className, colSpan }, ref) => {
  const isFiller = columnId === 'filler';
  const width = isFiller ? 'auto' : `calc(var(--col-${columnId}-size) * 1px)`;

  const background = isPinned && !isFiller ? 'bg-background' : '';

  return (
    <TableCell
      colSpan={colSpan}
      style={{ ...style, width }}
      className={`${background} ${className}`}
      ref={ref}
    >
      {children}
    </TableCell>
  );
});

TableBodyCell.displayName = 'TableBodyCell';

export default TableBodyCell;
