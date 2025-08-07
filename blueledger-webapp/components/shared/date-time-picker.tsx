'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { DatePicker } from './date-picker';

interface DateTimePickerProps {
  ref?: React.Ref<HTMLButtonElement | null>;
  value: Date;
  onChange: (date: Date) => void;
  onBlur: () => void;
}

export function DateTimePicker({ ref, value, onChange, onBlur }: DateTimePickerProps) {
  const pad = (num: number) => num.toString().padStart(2, '0');

  const timeValue = `${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(
    value.getSeconds(),
  )}`;

  const handleDateChange = (date: Date | undefined) => {
    if (!date)
      return;
    const newDate = new Date(date);
    newDate.setHours(value.getHours(), value.getMinutes(), value.getSeconds());
    onChange(newDate);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes, seconds] = e.target.value.split(':').map(Number);
    const newDate = new Date(value);
    newDate.setHours(hours ?? 0, minutes ?? 0, seconds ?? 0);
    onChange(newDate);
  };

  return (
    <div className="flex gap-1">
      <div className="flex-1">
        <DatePicker
          value={value}
          onChange={handleDateChange}
          onBlur={onBlur}
          ref={ref}
        />
      </div>
      <div className="w-[9rem]">
        <Input
          type="time"
          id="time"
          step="1"
          value={timeValue}
          onBlur={onBlur}
          onChange={handleTimeChange}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
}

DateTimePicker.displayName = 'DateTimePicker';
