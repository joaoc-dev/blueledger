'use client';

import dynamic from 'next/dynamic';

const ExpensesTableWrapper = dynamic(() => import('./expenses-table'), {
  ssr: false,
});

export default ExpensesTableWrapper;
