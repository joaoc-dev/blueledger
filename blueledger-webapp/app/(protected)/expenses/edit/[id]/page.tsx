import { notFound } from 'next/navigation';
import React from 'react';
import ExpenseForm from '@/components/expenses/expense-form';
import { getExpenseById } from '@/features/expenses/data';

const EditExpensePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const expense = await getExpenseById(id);

  if (!expense) notFound();

  return <ExpenseForm expense={expense} />;
};

export default EditExpensePage;
