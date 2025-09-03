import { notFound } from 'next/navigation';
import { ExpenseForm } from '@/features/expenses/components';
import { getExpenseById } from '@/features/expenses/data';
import { auth } from '@/lib/auth/auth';

async function EditExpensePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth();
  const userId = session!.user!.id;

  const expense = await getExpenseById(id, userId);

  if (!expense)
    notFound();

  return <ExpenseForm expense={expense} />;
}

export default EditExpensePage;
