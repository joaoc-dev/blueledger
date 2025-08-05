'use client';

import ButtonLink from '@/components/shared/button-link';
import { ViewOptions } from '@/components/shared/data-table/view-options';
import { Button } from '@/components/ui/button';
import { expenseKeys } from '@/constants/query-keys';
import { ExpenseDisplay } from '@/features/expenses/schemas';
import { useQueryClient } from '@tanstack/react-query';
import { Table } from '@tanstack/react-table';
import { Plus, RotateCw } from 'lucide-react';
import Filter from './filter';

interface ToolbarProps {
  table: Table<ExpenseDisplay>;
  isLoading?: boolean;
  isFetching?: boolean;
}

export const Toolbar = ({ table, isFetching, isLoading }: ToolbarProps) => {
  const queryClient = useQueryClient();

  const refreshData = () => {
    queryClient.refetchQueries({ queryKey: expenseKeys.byUser });
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
        <ViewOptions table={table} disabled={isLoading} />

        <ButtonLink size="sm" href="/expenses/new" disabled={isLoading}>
          <Plus />
          <span className="hidden md:block">Add</span>
        </ButtonLink>

        <Button
          className="h-8"
          variant="outline"
          onClick={refreshData}
          disabled={isDisabled}
        >
          <RotateCw />
        </Button>
      </div>
    </div>
  );
};
