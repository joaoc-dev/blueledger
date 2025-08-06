import { ExpenseForm } from '@/features/expenses/components';
import { getExpenseById } from '@/features/expenses/data';
import { auth } from '@/lib/auth/auth';
import { notFound } from 'next/navigation';

const EditExpensePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const session = await auth();
  const userId = session!.user!.id;

  const expense = await getExpenseById(id, userId);

  if (!expense) notFound();

  return <ExpenseForm expense={expense} />;
};

export default EditExpensePage;
