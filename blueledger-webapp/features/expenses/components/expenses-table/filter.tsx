'use client';

import type { Table } from '@tanstack/react-table';
import type { ExpenseDisplay } from '@/features/expenses/schemas';
import { ListFilter, Search, X } from 'lucide-react';
import { DateFilter } from '@/components/shared/data-table/date-filter';
import NumericRangeFilter from '@/components/shared/data-table/numeric-range-filter';
import { UniqueValuesFilter } from '@/components/shared/data-table/unique-values-filter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { CATEGORY_ICONS } from '@/features/expenses/constants';
import { useIsMobile } from '@/hooks/useIsMobile';

interface FilterProps {
  table: Table<ExpenseDisplay>;
  isDisabled?: boolean;
}

export function Filter({ table, isDisabled }: FilterProps) {
  const isMobile = useIsMobile();

  const popoverContentAlign = isMobile ? 'start' : 'end';

  const filterCount = table.getState().columnFilters.length;
  return (
    // <div className="bg-red-500 md:w-full flex items-center">a</div>
    <div className="md:w-full flex items-center py-4 gap-2">
      <div className="relative hidden md:block w-full max-w-xl">
        <SearchInput table={table} isDisabled={isDisabled} />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            disabled={isDisabled}
            className="relative flex items-center justify-center"
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
            <div>
              <UniqueValuesFilter
                column={table.getColumn('category')}
                title="Category"
                options={Object.entries(CATEGORY_ICONS).map(([key, value]) => ({
                  label: key,
                  value: key,
                  icon: value,
                }))}
              />
            </div>
            <NumericRangeFilter
              table={table}
              column={table.getColumn('price')!}
              title="Price"
            />
            <NumericRangeFilter
              table={table}
              column={table.getColumn('quantity')!}
              title="Quantity"
            />
            <NumericRangeFilter
              table={table}
              column={table.getColumn('totalPrice')!}
              title="Total Price"
            />
            <DateFilter
              table={table}
              column={table.getColumn('date')!}
              title="Start Date"
              type="from"
            />
            <DateFilter
              table={table}
              column={table.getColumn('date')!}
              title="End Date"
              type="to"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default Filter;

function SearchInput({
  table,
  isDisabled,
}: {
  table: Table<ExpenseDisplay>;
  isDisabled?: boolean;
}) {
  return (
    <>
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        size={16}
      />
      <Input
        placeholder="Search by description..."
        value={
          (table.getColumn('description')?.getFilterValue() as string) ?? ''
        }
        onChange={event =>
          table.getColumn('description')?.setFilterValue(event.target.value)}
        className="pl-8"
        disabled={isDisabled}
      />
    </>
  );
}
