'use client';

import type { Table } from '@tanstack/react-table';
import type { FriendshipDisplay } from '@/features/friendship/schemas';
import { useQueryClient } from '@tanstack/react-query';
import { RotateCw, UserPlus } from 'lucide-react';
import posthog from 'posthog-js';
import { useState } from 'react';
import { ViewOptions } from '@/components/shared/data-table/view-options';
import { Button } from '@/components/ui/button';
import { AnalyticsEvents } from '@/constants/analytics-events';
import { friendshipKeys } from '@/constants/query-keys';
import AddFriendModal from '../add-friend/add-friend-modal';
import { Filter } from './filter';

interface ToolbarProps {
  table: Table<FriendshipDisplay>;
  isLoading?: boolean;
  isFetching?: boolean;
}

export function Toolbar({ table, isFetching, isLoading }: ToolbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const refreshData = () => {
    posthog.capture(AnalyticsEvents.TABLE_REFRESH_CLICKED, {
      table: 'friends',
    });
    queryClient.refetchQueries({ queryKey: friendshipKeys.byUser });
  };

  const isDisabled = isLoading || isFetching;

  return (
    <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[minmax(0,600px)_1fr_auto] items-center">
      <Filter table={table} isDisabled={isDisabled} />

      <div className="min-w-[120px] w-full flex items-center justify-center text-sm text-muted-foreground">
        {isLoading && <span className="animate-pulse">Loading...</span>}
        {isFetching && !isLoading && (
          <span className="animate-pulse">Updating...</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <ViewOptions table={table} disabled={isDisabled} />

        <Button
          disabled={isLoading}
          className="border-1"
          onClick={() => setIsOpen(true)}
        >
          <UserPlus />
          <span className="hidden md:block">Add</span>
        </Button>

        <Button
          variant="outline"
          data-variant="blue-outline"
          onClick={refreshData}
          disabled={isDisabled}
        >
          <RotateCw />
        </Button>
      </div>

      <AddFriendModal isOpen={isOpen} setIsOpen={setIsOpen} />

    </div>
  );
}
