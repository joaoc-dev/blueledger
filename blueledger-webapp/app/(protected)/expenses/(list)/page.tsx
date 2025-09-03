import type { Metadata } from 'next';
import { ExpensesTable } from '@/features/expenses/components';
import { pageSeoConfigs } from '@/lib/seo';

export const metadata: Metadata = {
  title: pageSeoConfigs.expenses.title,
  description: pageSeoConfigs.expenses.description,
  robots: {
    index: false, // Protected pages should not be indexed
    follow: false,
  },
};

async function ExpensesPage() {
  return (
    <div>
      <ExpensesTable />
    </div>
  );
}

export default ExpensesPage;
