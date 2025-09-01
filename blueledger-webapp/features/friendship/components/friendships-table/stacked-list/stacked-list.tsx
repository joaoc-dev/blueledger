'use client';

import type { FriendshipDisplay } from '@/features/friendship/schemas';
import { useState } from 'react';
import { TabsWithBadges } from '@/components/shared/tabs-with-badges';
import { useActiveFriendshipsTable } from '../data-table/hooks/useActiveFriendshipsTable';
import { usePendingFriendshipsTable } from '../data-table/hooks/usePendingFriendshipsTable';
import { Toolbar } from '../toolbar';
import ListCard from './list-card';

interface StackedListProps {
  activeFriendships: FriendshipDisplay[];
  pendingFriendships: FriendshipDisplay[];
  isLoading?: boolean;
  isFetching?: boolean;
}

export function StackedList({
  activeFriendships,
  pendingFriendships,
  isLoading,
  isFetching,
}: StackedListProps) {
  const [activeTab, setActiveTab] = useState<'friends' | 'pending'>('friends');

  const {
    activeFriendshipsTable,
  } = useActiveFriendshipsTable(activeFriendships, {
    enablePagination: false,
    enableSorting: false,
  });

  const {
    pendingFriendshipsTable,
  } = usePendingFriendshipsTable(pendingFriendships, {
    enablePagination: false,
    enableSorting: false,
  });

  const activeTableRows = activeFriendshipsTable.getRowModel().rows;
  const pendingTableRows = pendingFriendshipsTable.getRowModel().rows;
  const hasActiveData = activeTableRows.length > 0;
  const hasPendingData = pendingTableRows.length > 0;

  const activeFriendshipsStackedList = (
    <div className="flex flex-col gap-2 w-full max-h-[calc(100vh-200px)] overflow-y-auto">
      {hasActiveData
        ? (
            activeTableRows.map(row => (
              <ListCard key={row.original.id} friendship={row.original} />
            ))
          )
        : (
            <div className="text-center text-sm text-muted-foreground">
              No results.
            </div>
          )}
    </div>
  );

  const pendingFriendshipsStackedList = (
    <div className="flex flex-col gap-2 w-full max-h-[calc(100vh-200px)] overflow-y-auto">
      {hasPendingData
        ? (
            pendingTableRows.map(row => (
              <ListCard key={row.original.id} friendship={row.original} />
            ))
          )
        : (
            <div className="text-center text-sm text-muted-foreground">
              No results.
            </div>
          )}
    </div>
  );

  const tabs = [
    {
      label: 'Friends',
      value: 'friends',
      content: activeFriendshipsStackedList,
      badge: activeTableRows.length,
    },
    {
      label: 'Pending',
      value: 'pending',
      content: pendingFriendshipsStackedList,
      badge: pendingTableRows.length,
    },
  ];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as 'friends' | 'pending');
  };

  // Use the active table based on current tab
  const activeTable = activeTab === 'friends' ? activeFriendshipsTable : pendingFriendshipsTable;

  return (
    <div className="space-y-4">
      <Toolbar table={activeTable} isFetching={isFetching} isLoading={isLoading} />

      <TabsWithBadges tabs={tabs} onTabChange={handleTabChange} />
    </div>
  );
}
