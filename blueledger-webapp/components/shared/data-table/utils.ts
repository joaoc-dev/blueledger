import { Column, Table } from '@tanstack/react-table';
import { CSSProperties } from 'react';

interface GetCommonPinningStylesProps<T> {
  column: Column<T>;
  table: Table<T>;
}

// These are the important styles to make sticky column pinning work!
// Apply styles like this using your CSS strategy of choice with this kind of logic to head cells, data cells, footer cells, etc.
export const getCommonPinningStyles = <T>({
  column,
  table,
}: GetCommonPinningStylesProps<T>): CSSProperties => {
  const isPinned = column.getIsPinned();

  const leftPinnedColumn = getLeftMostPinnedColumn(table);
  const isLeftPinnedColumn = column.id === leftPinnedColumn?.id;

  const rightPinnedColumn = getRightMostPinnedColumn(table);
  const isRightPinnedColumn = column.id === rightPinnedColumn?.id;

  const boxShadows = {
    left: '2px 0 2px -2px gray inset',
    right: '-2px 0 2px -2px gray inset',
  };

  let boxShadow = undefined;
  if (isLeftPinnedColumn) boxShadow = boxShadows.right;
  if (isRightPinnedColumn) boxShadow = boxShadows.left;

  return {
    boxShadow,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    position: isPinned ? 'sticky' : 'relative',
    zIndex: isPinned ? 1 : 0,
  };
};

const getLeftMostPinnedColumn = <T>(table: Table<T>): Column<T> | undefined => {
  const leftPinnedColumns = table
    .getAllColumns()
    .filter((col) => col.getIsPinned() === 'left');

  const len = leftPinnedColumns.length;
  if (len === 0) return undefined;
  if (len === 1) return leftPinnedColumns[0];

  // len >= 2
  const last = leftPinnedColumns[len - 1];
  if (last.id !== 'filler') return last;
  return leftPinnedColumns[len - 2];
};

const getRightMostPinnedColumn = <T>(
  table: Table<T>
): Column<T> | undefined => {
  const rightPinnedColumns = table
    .getAllColumns()
    .filter((col) => col.getIsPinned() === 'right');

  const len = rightPinnedColumns.length;
  if (len === 0) return undefined;
  if (len === 1) return rightPinnedColumns[0];

  // len >= 2
  const first = rightPinnedColumns[0];
  if (first.id !== 'filler') return first;
  return rightPinnedColumns[1];
};
