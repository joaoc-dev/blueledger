'use client';

import type { Table } from '@tanstack/react-table';
import type { GroupMembershipDisplay } from '../../schemas';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, RotateCw } from 'lucide-react';
import posthog from 'posthog-js';
import { useState } from 'react';
import { ViewOptions } from '@/components/shared/data-table/view-options';
import { Button } from '@/components/ui/button';
import { AnalyticsEvents } from '@/constants/analytics-events';
import { membershipKeys } from '@/constants/query-keys';
import GroupModal from '../modals/group-modal';
import { Filter } from './filter';

interface ToolbarProps {
  table: Table<GroupMembershipDisplay>;
  isLoading?: boolean;
  isFetching?: boolean;
}

export function Toolbar({ table, isFetching, isLoading }: ToolbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const refreshData = () => {
    posthog.capture(AnalyticsEvents.TABLE_REFRESH_CLICKED, {
      table: 'groups',
    });
    queryClient.refetchQueries({ queryKey: membershipKeys.byUser });
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
          onClick={() => {
            posthog.capture(AnalyticsEvents.GROUP_CREATE_CLICKED);
            setIsOpen(true);
          }}
        >
          <Plus />
          <span className="hidden md:block">Create</span>
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

      <GroupModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}
