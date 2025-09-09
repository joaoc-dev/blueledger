'use client';

import type { Table } from '@tanstack/react-table';
import type { FriendshipDisplay } from '@/features/friendship/schemas';
import { ListFilter, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

interface FilterProps {
  table: Table<FriendshipDisplay>;
  isDisabled?: boolean;
}

export function Filter({ table, isDisabled }: FilterProps) {
  const filterCount = table.getState().columnFilters.length;
  const popoverContentAlign = 'start';

  return (
    <div className="md:w-full flex items-center gap-2">
      <div className="relative hidden md:block w-full max-w-xl">
        <SearchInput table={table} isDisabled={isDisabled} />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={isDisabled}
            className="relative md:hidden flex items-center justify-center"
          >
            <ListFilter className="w-5 h-5" />
            {filterCount > 0 && (
              <span className="absolute top-[-5px] right-[-5px] min-w-4 h-4 px-1 flex items-center justify-center rounded-full text-[10px] font-medium bg-blue-200 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-700 shadow-sm">
                {filterCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="flex flex-col w-[310px]"
          align={popoverContentAlign}
        >
          <div className="flex items-center justify-between mb-2">
            <span>FILTER BY</span>
            <Button
              variant="ghost"
              size="sm"
              className="cursor-pointer"
              onClick={() => table.resetColumnFilters()}
            >
              <X />
              Clear All
            </Button>
          </div>
          <Separator className="mb-4" />
          <div className="flex flex-col gap-4">
            <div className="relative max-w-sm md:hidden">
              <SearchInput table={table} isDisabled={isDisabled} />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function SearchInput({
  table,
  isDisabled,
}: {
  table: Table<FriendshipDisplay>;
  isDisabled?: boolean;
}) {
  return (
    <>
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        size={16}
      />
      <Input
        placeholder="Search by name or email..."
        value={
          (table.getColumn('query')?.getFilterValue() as string) ?? ''
        }
        onChange={event =>
          table.getColumn('query')?.setFilterValue(event.target.value)}
        className="pl-8"
        disabled={isDisabled}
      />
    </>
  );
}
