import { TableRow } from '@/components/ui/table';
import TableBodyCell from '../table-body-cell';
import Spinner from '../../spinner';

const RowFullBodySkeleton = ({ colSpan }: { colSpan: number }) => {
  return (
    <TableRow>
      <TableBodyCell colSpan={colSpan} isPinned={false}>
        <Spinner className="size-12 mx-auto" />
      </TableBodyCell>
    </TableRow>
  );
};

export default RowFullBodySkeleton;
