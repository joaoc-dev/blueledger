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
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

const NewExpensePage = () => {
  const router = useRouter();

  const form = useForm<Expense>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: '',
      price: 0,
      quantity: 0,
    },
  });

  const onSubmit = async (data: Expense) => {
    const expense = {
      description: data.description,
      price: data.price,
      quantity: data.quantity,
    };

    try {
      await axios.post('/api/expenses', expense);
      router.push('/expenses');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
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

                    isNaN(number) ? field.onChange(0) : field.onChange(number);
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

                    isNaN(number) ? field.onChange(0) : field.onChange(number);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="mt-6 w-full" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default NewExpensePage;
