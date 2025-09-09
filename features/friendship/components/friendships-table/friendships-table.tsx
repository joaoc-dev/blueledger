'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { friendshipKeys } from '@/constants/query-keys';
import { useIsMobile } from '@/hooks/useIsMobile';
import { getQueryClient } from '@/lib/react-query/get-query-client';
import { getFriendships } from '../../client';
import { FRIENDSHIP_STATUS } from '../../constants';
import { DataTable } from './data-table';
import FriendshipsTableSkeleton from './friendships-table-skeleton';
import { StackedList } from './stacked-list';

// We implement a short minimum delay to avoid snappy UI
async function delayedGetFriendships() {
  const [, friendships] = await Promise.all([
    new Promise(resolve => setTimeout(resolve, 800)),
    getFriendships(),
  ]);
  return friendships;
}

function FriendshipsTable() {
  const isMobile = useIsMobile();

  const queryClient = getQueryClient();

  const {
    data: friendships,
    isFetching,
    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: friendshipKeys.byUser,
    queryFn: delayedGetFriendships,
  });

  const activeFriendships = useMemo(() =>
    friendships?.filter(friend => friend.status === FRIENDSHIP_STATUS.ACCEPTED) || [], [friendships]);
  const pendingFriendships = useMemo(() =>
    friendships?.filter(friend => friend.status === FRIENDSHIP_STATUS.PENDING) || [], [friendships]);

  if (isMobile === undefined)
    return <FriendshipsTableSkeleton />;

  if (isError) {
    console.error('error', error.message);
    return (
      <div className="flex flex-col gap-4 mx-auto items-center justify-center h-[500px]">
        Unexpected error. Please try again.
        <Button
          disabled={isFetching}
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: [friendshipKeys.byUser] })}
        >
          Retry
        </Button>
      </div>
    );
  }
  return isMobile
    ? (
        <StackedList
          activeFriendships={activeFriendships || []}
          pendingFriendships={pendingFriendships || []}
          isFetching={isFetching}
          isLoading={isLoading}
        />
      )
    : (
        <DataTable
          activeFriendships={activeFriendships || []}
          pendingFriendships={pendingFriendships || []}
          isFetching={isFetching}
          isLoading={isLoading}
        />
      );
}

export default FriendshipsTable;
