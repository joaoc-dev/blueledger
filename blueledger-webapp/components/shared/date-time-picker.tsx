'use client';

import { Input } from '@/components/ui/input';
import { DatePicker } from './date-picker';

interface DateTimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
}

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  const timeValue = `${value.getHours().toString().padStart(2, '0')}:${value
    .getMinutes()
    .toString()
    .padStart(2, '0')}:${value.getSeconds().toString().padStart(2, '0')}`;

  const handleDateChange = (date: Date | undefined) => {
    if (!date) return;
    const updated = new Date(date);
    updated.setHours(value.getHours(), value.getMinutes(), value.getSeconds());
    onChange(updated);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes, seconds] = e.target.value.split(':').map(Number);
    const updated = new Date(value);
    updated.setHours(hours);
    updated.setMinutes(minutes);
    updated.setSeconds(seconds || 0);
    onChange(updated);
  };

  return (
    <div className="flex gap-1">
      <div className="w-full">
        <DatePicker value={value} onChange={handleDateChange} />
      </div>
      <div className="">
        <Input
          type="time"
          id="time"
          step="1"
          value={timeValue}
          onChange={handleTimeChange}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
}
