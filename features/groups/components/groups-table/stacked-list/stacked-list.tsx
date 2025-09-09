'use client';

import type { GroupMembershipDisplay } from '@/features/groups/schemas';
import { useState } from 'react';
import { TabsWithBadges } from '@/components/shared/tabs-with-badges';

import { useActiveGroupsTable } from '../data-table/hooks/useActiveGroupsTable';
import { usePendingGroupInvitesTable } from '../data-table/hooks/usePendingGroupInvitesTable';
import { Toolbar } from '../toolbar';
import ListCard from './list-card';

interface StackedListProps {
  activeGroups: GroupMembershipDisplay[];
  pendingInvites: GroupMembershipDisplay[];
  isLoading?: boolean;
  isFetching?: boolean;
}

export function StackedList({
  activeGroups,
  pendingInvites,
  isLoading,
  isFetching,
}: StackedListProps) {
  const [activeTab, setActiveTab] = useState<'friends' | 'pending'>('friends');

  const {
    activeGroupsTable,
  } = useActiveGroupsTable(activeGroups, {
    enablePagination: false,
    enableSorting: false,
  });

  const {
    pendingInvitesTable,
  } = usePendingGroupInvitesTable(pendingInvites, {
    enablePagination: false,
    enableSorting: false,
  });

  const activeTableRows = activeGroupsTable.getRowModel().rows;
  const pendingTableRows = pendingInvitesTable.getRowModel().rows;
  const hasActiveData = activeTableRows.length > 0;
  const hasPendingData = pendingTableRows.length > 0;

  const activeGroupsStackedList = (
    <div className="flex flex-col gap-2 w-full max-h-[calc(100vh-200px)] overflow-y-auto">
      {hasActiveData
        ? (
            activeTableRows.map(row => (
              <ListCard key={row.original.id} currentUserMembership={row.original} />
            ))
          )
        : (
            <div className="text-center text-sm text-muted-foreground">
              No results.
            </div>
          )}
    </div>
  );

  const pendingInvitesStackedList = (
    <div className="flex flex-col gap-2 w-full max-h-[calc(100vh-200px)] overflow-y-auto">
      {hasPendingData
        ? (
            pendingTableRows.map(row => (
              <ListCard key={row.original.id} currentUserMembership={row.original} />
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
      label: 'Groups',
      value: 'groups',
      content: activeGroupsStackedList,
      badge: activeGroups.length,
    },
    {
      label: 'Pending',
      value: 'pending',
      content: pendingInvitesStackedList,
      badge: pendingInvites.length,
    },
  ];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as 'friends' | 'pending');
  };

  // Use the active table based on current tab
  const activeTable = activeTab === 'friends' ? activeGroupsTable : pendingInvitesTable;

  return (
    <div className="space-y-4">
      <Toolbar table={activeTable} isFetching={isFetching} isLoading={isLoading} />

      <TabsWithBadges tabs={tabs} onTabChange={handleTabChange} />
    </div>
  );
}
