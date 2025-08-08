'use client';

import { SquarePen, Trash2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';
import { useMemo } from 'react';
import { toast } from 'sonner';
import ButtonLink from '@/components/shared/button-link';
import ConfirmationDialog from '@/components/shared/confirmation-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useExpenses } from '@/features/expenses/hooks';

interface ItemOptionsProps {
  id: string;
  disabled?: boolean;
  isCompact?: boolean;
}

function ExpenseActions({ id, disabled, isCompact }: ItemOptionsProps) {
  const expenses = useExpenses();

  const searchParams = useSearchParams();
  const currentQuery = useMemo(() => {
    const params = new URLSearchParams(searchParams);
    return params.toString() ? `?${params.toString()}` : '';
  }, [searchParams]);

  const fullHref = `/expenses/edit/${id}${currentQuery}`;

  const handleDelete = async () => {
    try {
      posthog.capture('expense_delete_clicked', { id });
      toast.loading('Deleting expense...', {
        id,
      });

      await expenses.deleteExpenseMutation.mutateAsync(id);

      toast.success('Expense deleted successfully', {
        id,
      });
    }
    catch (error) {
      console.error('Error deleting expense', error);

      toast.error('Failed to delete expense', {
        id,
      });
    }
  };

  return (
    <>
      {isCompact
        ? (
            <ButtonLink variant="ghost" href={fullHref} disabled={disabled}>
              <SquarePen />
            </ButtonLink>
          )
        : (
            <ButtonLink
              href={fullHref}
              variant="outline"
              size="sm"
              disabled={disabled}
              className="flex-1 text-primary border-primary hover:bg-primary/10 dark:hover:bg-primary/15 hover:shadow-xs focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              <span>Details</span>
            </ButtonLink>
          )}
      <Dialog>
        <DialogTrigger asChild>
          {isCompact
            ? (
                <Button
                  className="cursor-pointer"
                  variant="ghost"
                  disabled={disabled}
                >
                  <Trash2 />
                </Button>
              )
            : (
                <Button
                  className="flex-1 border-destructive text-destructive/90 hover:bg-destructive/10 focus-visible:ring-destructive/40 cursor-pointer"
                  variant="outline"
                  disabled={disabled}
                  size="sm"
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
}

export default ExpenseActions;
