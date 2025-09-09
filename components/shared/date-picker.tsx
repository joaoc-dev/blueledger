'use client';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import React, { useState } from 'react';
import { Calendar } from '@/components/third-party/calendar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  ref?: React.Ref<HTMLButtonElement | null>;
  value: Date;
  onChange: (date: Date) => void;
  onBlur: () => void;
}

export function DatePicker({ ref, value, onChange, onBlur }: DatePickerProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange(date);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          onBlur={onBlur}
          variant="outline"
          className={cn(
            'w-full  justify-start text-left font-normal',
            !value && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="h-4 w-4" />
          {value ? format(value, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleSelect}
          autoFocus
          required
          className="h-85"
        />
      </PopoverContent>
    </Popover>
  );
}

DatePicker.displayName = 'DatePicker';
