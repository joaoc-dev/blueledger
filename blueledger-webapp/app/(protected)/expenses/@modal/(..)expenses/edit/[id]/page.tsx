import Modal from '@/components/shared/modal';
import { ExpenseForm } from '@/features/expenses/components';
import { getExpenseById } from '@/features/expenses/data';
import { auth } from '@/lib/auth/auth';
import { notFound } from 'next/navigation';

const EditExpensePageModal = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const session = await auth();
  const userId = session!.user!.id;

  const expense = await getExpenseById(id, userId);

  if (!expense) notFound();

  return (
    <Modal title="Edit Expense" open={true}>
      <ExpenseForm expense={expense} />
    </Modal>
  );
};

export default EditExpensePageModal;
