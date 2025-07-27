import { DragAlongCell } from '@/components/shared/data-table/drag-along-cell';
import { TableRow } from '@/components/ui/table';
import React from 'react';
import { TABLE_CONFIG } from '../../constants';

interface RowHiddenProps {
  id: string;
  sortableHeaderIds: string[];
}

const RowHidden = ({ id, sortableHeaderIds }: RowHiddenProps) => {
  return (
    <TableRow
      key={id}
      className="invisible h-0"
      style={{ height: `${TABLE_CONFIG.ROW_SIZE}px` }}
    >
      {sortableHeaderIds.map((columnId) => (
        <DragAlongCell key={`${id}-${columnId}`} columnId={columnId}>
          Placeholder
        </DragAlongCell>
      ))}
    </TableRow>
  );
};

export default RowHidden;
