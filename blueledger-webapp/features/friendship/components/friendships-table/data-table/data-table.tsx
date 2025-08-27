'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { FriendshipDisplay } from '@/features/friendship/schemas';
import { useState } from 'react';
import DraggableTable from '@/components/shared/data-table/draggable/draggable-table';
import { Pagination } from '@/components/shared/data-table/pagination';
import TabsWithBadges from '@/components/shared/tabs-with-badges';
import { Toolbar } from '../toolbar';
import { activeFriendshipsColumns, pendingFriendshipsColumns } from './columns';
import { useActiveFriendshipsTable } from './hooks/useActiveFriendshipsTable';
import { usePendingFriendshipsTable } from './hooks/usePendingFriendshipsTable';

interface DataTableProps {
  activeFriendships: FriendshipDisplay[];
  pendingFriendships: FriendshipDisplay[];
  isLoading?: boolean;
  isFetching?: boolean;
}

export function DataTable({
  activeFriendships,
  pendingFriendships,
  isLoading,
  isFetching,
}: DataTableProps) {
  const [activeTab, setActiveTab] = useState<'friends' | 'pending'>('friends');

  const {
    activeFriendshipsTable,
    setColumnOrder: setActiveFriendshipsColumnOrder,
  } = useActiveFriendshipsTable(activeFriendships);

  const {
    pendingFriendshipsTable,
    setColumnOrder: setPendingFriendshipsColumnOrder,
  } = usePendingFriendshipsTable(pendingFriendships);

  const activeFriendshipsDraggableTable = (
    <DraggableTable
      table={activeFriendshipsTable}
      setColumnOrder={setActiveFriendshipsColumnOrder}
      isLoading={isLoading}
      isFetching={isFetching}
      columns={activeFriendshipsColumns as ColumnDef<FriendshipDisplay>[]}
    />
  );
  const pendingFriendshipsDraggableTable = (
    <DraggableTable
      table={pendingFriendshipsTable}
      setColumnOrder={setPendingFriendshipsColumnOrder}
      isLoading={isLoading}
      isFetching={isFetching}
      columns={pendingFriendshipsColumns as ColumnDef<FriendshipDisplay>[]}
    />
  );

  const tabs = [
    {
      label: 'Friends',
      value: 'friends',
      content: activeFriendshipsDraggableTable,
      badge: activeFriendships.length,
    },
    {
      label: 'Pending',
      value: 'pending',
      content: pendingFriendshipsDraggableTable,
      badge: pendingFriendships.length,
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

      <Pagination table={activeTable} displaySelectedRows={false} enableRowsPerPage={false} />
    </div>
  );
}
