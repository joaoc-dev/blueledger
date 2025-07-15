'use client';

import ConfirmationDialog from '@/components/shared/confirmation-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { TableCell } from '@/components/ui/table';
import { useExpenses } from '@/hooks/useExpenses';
import { SquarePen, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface ExpenseRowActionsProps {
  id: string;
  disabled?: boolean;
}
const ExpenseRowActions = ({ id, disabled }: ExpenseRowActionsProps) => {
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
      toast.error('Failed to delete expense', {
        id: id,
      });
    }
  };

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
          onConfirm={handleDelete}
          confirmButtonText="Delete"
          cancelButtonText="Cancel"
        />
      </Dialog>
    </>
  );
};

export default ExpenseRowActions;
