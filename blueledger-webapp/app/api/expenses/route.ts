import { withAuth } from '@/lib/api/withAuth';
import { createExpenseSchema } from '@/features/expenses/schemas';
import { NextAuthRequest } from 'next-auth';
import { NextResponse } from 'next/server';
import { createExpense, getExpenses } from '@/features/expenses/data';
import { validateRequest } from '../validateRequest';

export const POST = withAuth(async function POST(request: NextAuthRequest) {
  try {
    const body = await request.json();
    const userId = request.auth!.user!.id;

    const { error, data } = validateRequest(createExpenseSchema, {
      ...body,
      user: userId,
    });
    if (error) return error;

    const expense = await createExpense(data!);

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.log('Error creating expense', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
});

export const GET = withAuth(async function GET() {
  try {
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
