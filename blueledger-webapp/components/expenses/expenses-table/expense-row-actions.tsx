'use client';

import ConfirmationDialog from '@/components/shared/confirmation-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { TableCell } from '@/components/ui/table';
import { SquarePen, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface ExpenseRowActionsProps {
  id: string;
  onDelete: () => void;
  disabled?: boolean;
}

const ExpenseRowActions = ({
  id,
  onDelete,
  disabled,
}: ExpenseRowActionsProps) => {
  return (
    <>
      {disabled ? (
        <Button variant="ghost" disabled={disabled}>
          <SquarePen />
        </Button>
      ) : (
        <Button variant="ghost" asChild disabled={disabled}>
          <Link href={`/expenses/edit/${id}`}>
            <SquarePen />
          </Link>
        </Button>
      )}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="cursor-pointer"
            variant="ghost"
            disabled={disabled}
          >
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
    </>
  );
};

export default ExpenseRowActions;
