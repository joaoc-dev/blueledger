import React from 'react';
import { DataTable } from './data-table/data-table';
import { StackedList } from './stacked-list';

const ExpensesTableSkeleton = () => {
  return (
    <>
      <div className="md:hidden">
        <StackedList data={[]} isLoading={true} />
      </div>
      <div className="space-y-4 hidden md:block">
        <DataTable data={[]} isLoading={true} />
      </div>
    </>
  );
};

export default ExpensesTableSkeleton;
