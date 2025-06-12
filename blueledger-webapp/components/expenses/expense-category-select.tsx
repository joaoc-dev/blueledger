import * as React from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CATEGORY_ICONS,
  EXPENSE_CATEGORIES,
} from '@/constants/expense-category';

interface ExpenseCategorySelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function ExpenseCategorySelect({
  value,
  onChange,
}: ExpenseCategorySelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Categories</SelectLabel>
          {EXPENSE_CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICONS[category];
            return (
              <SelectItem key={category} value={category}>
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {category}
                </div>
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
