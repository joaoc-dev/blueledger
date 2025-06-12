'use client';

import ConfirmationDialog from '@/components/shared/confirmation-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { TableCell } from '@/components/ui/table';
import axios from 'axios';
import { SquarePen, Trash2 } from 'lucide-react';
import Link from 'next/link';
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
            onConfirm={() => handleDelete(id)}
            confirmButtonText="Delete"
            cancelButtonText="Cancel"
          />
        </Dialog>
      </TableCell>
    </>
  );
};

export default ExpenseRowActions;
