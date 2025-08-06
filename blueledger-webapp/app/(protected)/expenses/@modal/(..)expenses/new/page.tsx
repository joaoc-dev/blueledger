'use client';

import Modal from '@/components/shared/modal';
import { ExpenseForm } from '@/features/expenses/components';

const NewExpensePageModal = () => {
  return (
    <Modal title="New Expense" open={true}>
      <ExpenseForm />
    </Modal>
  );
};

export default NewExpensePageModal;
