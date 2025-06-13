'use client';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/custom/calendar';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import React from 'react';

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  onBlur: () => void;
}

export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  ({ value, onChange, onBlur }, ref) => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            onBlur={onBlur}
            variant="outline"
            className={cn(
              'w-[240px] justify-start text-left font-normal',
              !value && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            autoFocus
            required
          />
        </PopoverContent>
      </Popover>
    );
  }
);

DatePicker.displayName = 'DatePicker';
