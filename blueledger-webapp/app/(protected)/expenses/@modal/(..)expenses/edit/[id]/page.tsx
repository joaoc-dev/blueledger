import { notFound } from 'next/navigation';
import Modal from '@/components/shared/modal';
import { ExpenseForm } from '@/features/expenses/components';
import { getExpenseById } from '@/features/expenses/data';
import { auth } from '@/lib/auth/auth';

async function EditExpensePageModal({
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

  return (
    <Modal title="Edit Expense" open={true} goBackOnClose={true}>
      <ExpenseForm expense={expense} />
    </Modal>
  );
}

export default EditExpensePageModal;
