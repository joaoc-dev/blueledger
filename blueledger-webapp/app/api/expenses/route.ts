import { withAuth } from '@/lib/api/withAuth';
import dbConnect from '@/lib/db/mongoose-client';
import { createExpenseSchema } from '@/lib/validations/expense-schema';
import { NextAuthRequest } from 'next-auth';
import { NextResponse } from 'next/server';
import { createExpense, getExpenses } from '@/lib/data/expenses';

export const POST = withAuth(async function POST(request: NextAuthRequest) {
  try {
    const body = await request.json();
    const validation = createExpenseSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.format() },
        { status: 400 }
      );
    }

    await dbConnect();

    const { description, price, quantity, category, date } = validation.data;
    const totalPrice = price * quantity;

    const expense = await createExpense({
      description,
      price,
      quantity,
      totalPrice,
      category,
      date,
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.log('Error creating expense', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
});

export const GET = withAuth(async function GET(request: NextAuthRequest) {
  try {
    await dbConnect();
    const expenses = await getExpenses();
    return NextResponse.json(expenses);
  } catch (error) {
    console.log('Error getting expenses', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
});
