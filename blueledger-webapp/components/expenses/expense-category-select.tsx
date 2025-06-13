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
import { ExpenseFormData } from '@/lib/validations/expense-schema';

interface ExpenseCategorySelectProps {
  value: ExpenseFormData['category'] | undefined;
  onChange: (value: ExpenseFormData['category']) => void;
  onBlur: () => void;
}

export const ExpenseCategorySelect = React.forwardRef<
  HTMLButtonElement,
  ExpenseCategorySelectProps
>(({ value, onChange, onBlur }, ref) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger ref={ref} onBlur={onBlur} className="w-full">
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
});

ExpenseCategorySelect.displayName = 'ExpenseCategorySelect';
