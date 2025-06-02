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
import { Expense, expenseSchema } from '@/schemas/expenseSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface ExpenseFormProps {
  expense?: {
    id: string;
    description: string;
    price: number;
    quantity: number;
  };
}

const ExpenseForm = ({ expense }: ExpenseFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<Expense>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: expense?.description || '',
      price: expense?.price || 0,
      quantity: expense?.quantity || 0,
    },
  });

  const onSubmit = async (data: Expense) => {
    try {
      setIsSubmitting(true);
      if (expense?.id) {
        await axios.patch(`/api/expenses/${expense.id}`, data);
        toast.success('Successfully updated expense');
      } else {
        await axios.post('/api/expenses', data);
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
