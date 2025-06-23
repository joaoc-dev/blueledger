'use client';

import Modal from '@/components/shared/modal';
import ExpenseForm from '@/components/expenses/expense-form';

const NewExpensePageModal = () => {
  return (
    <Modal title="New Expense" open={true}>
      <ExpenseForm />
    </Modal>
  );
};

export default NewExpensePageModal;
