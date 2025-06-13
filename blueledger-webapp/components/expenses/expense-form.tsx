'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useExpenseForm } from '@/hooks/use-expense-form';
import { ExpenseFormData } from '@/lib/validations/expense-schema';
import { createExpense, updateExpense } from '@/services/expenses';
import { ExpenseType } from '@/types/expense';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { ExpenseCategorySelect } from './expense-category-select';
import { DateTimePicker } from '../shared/date-time-picker';

interface ExpenseFormProps {
  expense?: ExpenseType;
}

const ExpenseForm = ({ expense }: ExpenseFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useExpenseForm(expense);

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      setIsSubmitting(true);
      if (expense?.id) {
        await updateExpense(expense.id, data);
        toast.success('Successfully updated expense');
      } else {
        await createExpense(data);
        toast.success('Successfully created expense');
      }

      router.push('/expenses');
    } catch (error) {
      console.error(error);

      setIsSubmitting(false);
      toast.error('Failed to create expense');
    }
  };

  return (
    <Form {...form}>
      <form
        className="space-y-4 max-w-sm mx-auto"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} type="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value;
                    const number = Number(value);

                    if (isNaN(number)) {
                      field.onChange(0);
                    } else {
                      field.onChange(number);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value;
                    const number = Number(value);

                    if (isNaN(number)) {
                      field.onChange(0);
                    } else {
                      field.onChange(number);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <ExpenseCategorySelect
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <DateTimePicker value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="mt-6 w-full cursor-pointer"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" /> Submitting...
            </>
          ) : (
            'Submit'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ExpenseForm;
