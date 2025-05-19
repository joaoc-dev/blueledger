'use client';

import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';
import { Dialog } from '@/components/ui/dialog';
import { TableCell } from '@/components/ui/table';
import React from 'react';
import ConfirmationDialog from '@/app/components/confirmation-dialog';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const ExpenseRowActions = ({ id }: { id: string }) => {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    await axios.delete(`/api/expenses/${id}`);
    router.refresh();
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
