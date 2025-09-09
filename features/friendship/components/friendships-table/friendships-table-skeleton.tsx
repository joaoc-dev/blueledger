import React from 'react';
import { DataTable } from './data-table';
import { StackedList } from './stacked-list';

function FriendshipsTableSkeleton() {
  return (
    <>
      <div className="md:hidden">
        <StackedList activeFriendships={[]} pendingFriendships={[]} isLoading={true} />
      </div>
      <div className="space-y-4 hidden md:block">
        <DataTable activeFriendships={[]} pendingFriendships={[]} isLoading={true} />
      </div>
    </>
  );
}

export default FriendshipsTableSkeleton;
