'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { GroupMembershipDisplay } from '@/features/groups/schemas';
import { useState } from 'react';
import DraggableTable from '@/components/shared/data-table/draggable/draggable-table';
import { Pagination } from '@/components/shared/data-table/pagination';
import { TabsWithBadges } from '@/components/shared/tabs-with-badges';
import { Toolbar } from '@/features/groups/components/groups-table/toolbar';
import { activeGroupsColumns, pendingInvitesColumns } from './columns';
import { useActiveGroupsTable } from './hooks/useActiveGroupsTable';
import { usePendingGroupInvitesTable } from './hooks/usePendingGroupInvitesTable';

interface DataTableProps {
  activeGroups: GroupMembershipDisplay[];
  pendingInvites: GroupMembershipDisplay[];
  isLoading?: boolean;
  isFetching?: boolean;
}

export function DataTable({
  activeGroups,
  pendingInvites,
  isLoading,
  isFetching,
}: DataTableProps) {
  const [activeTab, setActiveTab] = useState<'groups' | 'pending'>('groups');

  const {
    activeGroupsTable,
    setColumnOrder: setActiveGroupsColumnOrder,
  } = useActiveGroupsTable(activeGroups);

  const {
    pendingInvitesTable,
    setColumnOrder: setPendingInvitesColumnOrder,
  } = usePendingGroupInvitesTable(pendingInvites);

  const activeGroupsDraggableTable = (
    <DraggableTable
      table={activeGroupsTable}
      setColumnOrder={setActiveGroupsColumnOrder}
      isLoading={isLoading}
      isFetching={isFetching}
      columns={activeGroupsColumns as unknown as ColumnDef<any>[]}
    />
  );

  const pendingInvitesDraggableTable = (
    <DraggableTable
      table={pendingInvitesTable}
      setColumnOrder={setPendingInvitesColumnOrder}
      isLoading={isLoading}
      isFetching={isFetching}
      columns={pendingInvitesColumns as unknown as ColumnDef<any>[]}
    />
  );

  const tabs = [
    {
      label: 'Groups',
      value: 'groups',
      content: activeGroupsDraggableTable,
      badge: activeGroups.length,
    },
    {
      label: 'Pending',
      value: 'pending',
      content: pendingInvitesDraggableTable,
      badge: pendingInvites.length,
    },
  ];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as 'groups' | 'pending');
  };

  const table = activeTab === 'groups' ? activeGroupsTable : pendingInvitesTable;

  return (
    <div className="space-y-4">
      <Toolbar table={table} isFetching={isFetching} isLoading={isLoading} />

      <TabsWithBadges tabs={tabs} onTabChange={handleTabChange} />

      <Pagination table={table} displaySelectedRows={false} enableRowsPerPage={false} />
    </div>
  );
}
