import Expense from '@/models/expense';
import { notFound } from 'next/navigation';
import React from 'react';
import mongoose from 'mongoose';
import ExpenseForm from '../../../../../components/expenses/expense-form';

const EditExpensePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) notFound();

  const expense = await Expense.findById(id);
  if (!expense) notFound();

  return (
    <ExpenseForm
      expense={{
        id: expense.id,
        description: expense.description,
        price: expense.price,
        quantity: expense.quantity,
      }}
    />
  );
};

export default EditExpensePage;
