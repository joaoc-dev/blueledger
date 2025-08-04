'use client';

import ButtonLink from '@/components/shared/button-link';
import ConfirmationDialog from '@/components/shared/confirmation-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useExpenses } from '@/features/expenses/hooks';
import { SquarePen, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface ItemOptionsProps {
  id: string;
  disabled?: boolean;
  isCompact?: boolean;
}

const ExpenseActions = ({ id, disabled, isCompact }: ItemOptionsProps) => {
  const expenses = useExpenses();

  const handleDelete = async () => {
    try {
      toast.loading('Deleting expense...', {
        id: id,
      });

      await expenses.deleteExpenseMutation.mutateAsync(id);

      toast.success('Expense deleted successfully', {
        id: id,
      });
    } catch (error) {
      console.log('Error deleting expense', error);

      toast.error('Failed to delete expense', {
        id: id,
      });
    }
  };

  return (
    <>
      {isCompact ? (
        <ButtonLink
          variant="ghost"
          href={`/expenses/edit/${id}`}
          disabled={disabled}
        >
          <SquarePen />
        </ButtonLink>
      ) : (
        <ButtonLink href={`/expenses/edit/${id}`} disabled={disabled}>
          <span>Details</span>
        </ButtonLink>
      )}
      <Dialog>
        <DialogTrigger asChild>
          {isCompact ? (
            <Button
              className="cursor-pointer"
              variant="ghost"
              disabled={disabled}
            >
              <Trash2 />
            </Button>
          ) : (
            <Button
              className="cursor-pointer"
              variant="destructive"
              disabled={disabled}
            >
              <span>Delete</span>
            </Button>
          )}
        </DialogTrigger>
        <ConfirmationDialog
          title="Are you sure you want to delete this expense?"
          description="This operation is irreversible."
          onConfirm={handleDelete}
          confirmButtonText="Delete"
          cancelButtonText="Cancel"
        />
      </Dialog>
    </>
  );
};

export default ExpenseActions;
