'use client';

import dynamic from 'next/dynamic';
import ExpensesTableSkeleton from './expenses-table-skeleton';

const DynamicTableWrapper = dynamic(() => import('./expenses-table'), {
  ssr: false,
  loading: () => <ExpensesTableSkeleton />,
});

export default DynamicTableWrapper;
