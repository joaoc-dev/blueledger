import { notFound } from 'next/navigation';
import React from 'react';
import ExpenseForm from '@/components/expenses/expense-form';
import { getExpenseById } from '@/lib/data/expenses';
import Modal from '@/components/shared/modal';

const EditExpensePageModal = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const expense = await getExpenseById(id);

  if (!expense) notFound();

  return (
    <Modal title="Edit Expense" open={true}>
      <ExpenseForm expense={expense} />
    </Modal>
  );
};

export default EditExpensePageModal;
