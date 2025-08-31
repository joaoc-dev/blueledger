import React from 'react';
import { DataTable } from './data-table';
import { StackedList } from './stacked-list';

function GroupsTableSkeleton() {
  return (
    <>
      <div className="md:hidden">
        <StackedList activeGroups={[]} pendingInvites={[]} isLoading={true} />
      </div>
      <div className="space-y-4 hidden md:block">
        <DataTable activeGroups={[]} pendingInvites={[]} isLoading={true} />
      </div>
    </>
  );
}

export default GroupsTableSkeleton;
