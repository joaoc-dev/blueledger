'use client';

import Modal from '@/components/shared/modal';
import { ExpenseForm } from '@/features/expenses/components';

function NewExpensePageModal() {
  return (
    <Modal title="New Expense" open={true} goBackOnClose={true}>
      <ExpenseForm />
    </Modal>
  );
}

export default NewExpensePageModal;
