'use client';

import ConfirmationDialog from '@/app/components/confirmation-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { TableCell } from '@/components/ui/table';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const ExpenseRowActions = ({ id }: { id: string }) => {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/expenses/${id}`);
      router.refresh();
      toast.success('Expense deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete expense');
    }
  };

  return (
    <TableCell>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive">Delete</Button>
        </DialogTrigger>
        <ConfirmationDialog
          title="Are you sure you want to delete this expense?"
          description="This operation is irreversible."
          onConfirm={() => handleDelete(id)}
          confirmButtonText="Delete"
          cancelButtonText="Cancel"
        />
      </Dialog>
    </TableCell>
  );
};

export default ExpenseRowActions;
