'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { groupMembershipKeys } from '@/constants/query-keys';
import { useIsMobile } from '@/hooks/useIsMobile';
import { getQueryClient } from '@/lib/react-query/get-query-client';
import { getMemberships } from '../../client';
import { GROUP_MEMBERSHIP_STATUS } from '../../constants';
import { DataTable } from './data-table';
import GroupsTableSkeleton from './groups-table-skeleton';
import { StackedList } from './stacked-list';

// We implement a short minimum delay to avoid snappy UI
async function delayedGetMemberships() {
  const [, memberships] = await Promise.all([
    new Promise(resolve => setTimeout(resolve, 800)),
    getMemberships(),
  ]);
  return memberships;
}

function GroupsTable() {
  const isMobile = useIsMobile();
  const queryClient = getQueryClient();

  const {
    data: memberships,
    isFetching,
    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: groupMembershipKeys.byUser,
    queryFn: delayedGetMemberships,
  });

  const activeGroups = useMemo(() =>
    memberships?.filter(m => m.status === GROUP_MEMBERSHIP_STATUS.ACCEPTED) ?? [], [memberships]);

  const pendingInvites = useMemo(() =>
    memberships?.filter(m => m.status === GROUP_MEMBERSHIP_STATUS.PENDING) ?? [], [memberships]);

  if (isMobile === undefined)
    return <GroupsTableSkeleton />;

  if (isError) {
    console.error('error', error.message);
    return (
      <div className="flex flex-col gap-4 mx-auto items-center justify-center h-[500px]">
        <p className="text-sm text-muted-foreground">Unexpected error. Please try again.</p>
        <Button
          disabled={isFetching}
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: groupMembershipKeys.byUser })}
        >
          Retry
        </Button>
      </div>
    );
  }

  return isMobile
    ? (
        <StackedList
          activeGroups={activeGroups || []}
          pendingInvites={pendingInvites || []}
          isFetching={isFetching}
          isLoading={isLoading}
        />
      )
    : (
        <DataTable
          activeGroups={activeGroups || []}
          pendingInvites={pendingInvites || []}
          isFetching={isFetching}
          isLoading={isLoading}
        />
      );
}

export default GroupsTable;
