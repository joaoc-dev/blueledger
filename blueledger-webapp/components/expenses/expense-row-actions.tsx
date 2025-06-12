'use client';

import ConfirmationDialog from '@/components/shared/confirmation-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { TableCell } from '@/components/ui/table';
import { SquarePen, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ExpenseRowActionsProps {
  id: string;
  onDelete: () => void;
}

const ExpenseRowActions = ({ id, onDelete }: ExpenseRowActionsProps) => {
  return (
    <>
      <TableCell className="w-20 text-right">
        <Button variant="ghost" asChild>
          <Link href={`/expenses/edit/${id}`}>
            <SquarePen />
          </Link>
        </Button>
      </TableCell>
      <TableCell className="w-20 text-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="cursor-pointer" variant="ghost">
              <Trash2 />
            </Button>
          </DialogTrigger>
          <ConfirmationDialog
            title="Are you sure you want to delete this expense?"
            description="This operation is irreversible."
            onConfirm={onDelete}
            confirmButtonText="Delete"
            cancelButtonText="Cancel"
          />
        </Dialog>
      </TableCell>
    </>
  );
};

export default ExpenseRowActions;
