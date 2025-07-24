import React from 'react';
import { DataTable } from './data-table';

const TableSkeleton = () => {
  return (
    <div className="space-y-4">
      <DataTable data={[]} isLoading={true} />
    </div>
  );
};

export default TableSkeleton;
