'use client';

import type { Column, Table } from '@tanstack/react-table';
import { format } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';
import { useLayoutEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DateRangeFilterValue {
  from?: Date;
  to?: Date;
}

interface DateFilterProps<TData, TValue> {
  table: Table<TData>;
  column: Column<TData, TValue>;
  title?: string;
  type: 'from' | 'to';
}

export function DateFilter<TData, TValue>({
  table,
  column,
  title = 'Select date',
  type,
}: DateFilterProps<TData, TValue>) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const columnFilters = table.getState().columnFilters;

  useLayoutEffect(() => {
    const value = column?.getFilterValue() as DateRangeFilterValue | undefined;
    setSelectedDate(type === 'from' ? value?.from : value?.to);
  }, [column, type, columnFilters]);

  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date);

    const prev = (column?.getFilterValue() as DateRangeFilterValue) ?? {};
    const newFilterValue
      = type === 'from'
        ? { ...prev, from: date ?? undefined }
        : { ...prev, to: date ?? undefined };

    column?.setFilterValue(newFilterValue);
    setOpen(false);
  };

  const handleClear = () => {
    setSelectedDate(undefined);
    const prev = (column?.getFilterValue() as DateRangeFilterValue) ?? {};
    const newFilterValue
      = type === 'from'
        ? { ...prev, from: undefined }
        : { ...prev, to: undefined };

    column?.setFilterValue(newFilterValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <CalendarIcon className="mr-2 size-4" />
          {selectedDate ? format(selectedDate, 'LLL dd, y') : title}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-4" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={date => handleSelect(date ?? undefined)}
          numberOfMonths={1}
          className="h-80"
        />
        <div className="flex justify-between space-x-2 mt-4">
          <Button size="sm" variant="ghost" onClick={handleClear}>
            <X className="mr-2 h-4 w-4" />
            {' '}
            Clear
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
