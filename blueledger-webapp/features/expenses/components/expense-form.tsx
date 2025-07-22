'use client';

import { DateTimePicker } from '@/components/shared/date-time-picker';
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
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { useExpenseForm, useExpenses } from '../hooks';
import { ExpenseDisplay, ExpenseFormData } from '../schemas';
import { ExpenseCategorySelect } from './expense-category-select';

interface ExpenseFormProps {
  expense?: ExpenseDisplay;
}

const ExpenseForm = ({ expense }: ExpenseFormProps) => {
  const form = useExpenseForm(expense);
  const router = useRouter();
  const expenses = useExpenses();

  const handleSubmit = async (data: ExpenseFormData) => {
    const isUpdate = !!expense?.id;
    const toastId = expense?.id ?? uuidv4();

    toast.loading(`${isUpdate ? 'Updating' : 'Adding'} expense...`, {
      id: toastId,
    });

    try {
      if (isUpdate) {
        await expenses.updateExpenseMutation.mutateAsync({
          id: expense.id!,
          updatedExpense: data,
        });
      } else {
        await expenses.addExpenseMutation.mutateAsync(data);
      }

      toast.success(`${isUpdate ? 'Updated' : 'Added'} expense`, {
        id: toastId,
      });

      router.back();
    } catch (error) {
      console.log('Error submitting expense', error);
      toast.error(`Failed to ${isUpdate ? 'update' : 'add'} expense`, {
        id: toastId,
      });
    }
  };

  return (
    <Form {...form}>
      <form
        className="space-y-4 max-w-sm mx-auto"
        onSubmit={form.handleSubmit(handleSubmit)}
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
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <ExpenseCategorySelect
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  ref={field.ref}
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
                <DateTimePicker
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="mt-6 w-full cursor-pointer"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
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
