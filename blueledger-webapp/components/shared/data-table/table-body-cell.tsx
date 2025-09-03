import { TableCell } from '@/components/ui/table';

interface TableBodyCellProps {
  ref?: React.Ref<HTMLTableCellElement | null>;
  isPinned: boolean;
  children?: React.ReactNode;
  columnId?: string;
  style?: React.CSSProperties;
  className?: string;
  colSpan?: number;
}

function TableBodyCell({ ref, children, style, columnId, isPinned, className, colSpan }: TableBodyCellProps) {
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
}

TableBodyCell.displayName = 'TableBodyCell';

export default TableBodyCell;
