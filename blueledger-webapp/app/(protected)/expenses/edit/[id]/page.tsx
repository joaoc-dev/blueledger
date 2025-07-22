import { ExpenseForm } from '@/features/expenses/components';
import { getExpenseById } from '@/features/expenses/data';
import { notFound } from 'next/navigation';

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
