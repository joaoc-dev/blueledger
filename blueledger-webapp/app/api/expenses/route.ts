import type { NextAuthRequest } from 'next-auth';
import { NextResponse } from 'next/server';
import { createExpense, getExpenses } from '@/features/expenses/data';
import { createExpenseSchema } from '@/features/expenses/schemas';
import { withAuth } from '@/lib/api/withAuth';
import { validateRequest } from '../validateRequest';

export const POST = withAuth(async (request: NextAuthRequest) => {
  try {
    const body = await request.json();
    const userId = request.auth!.user!.id;

    const validationResult = validateRequest(createExpenseSchema, {
      data: {
        ...body,
        user: userId,
      },
    });
    if (!validationResult.success)
      return validationResult.error;

    const expense = await createExpense(validationResult.data!);

    return NextResponse.json(expense, { status: 201 });
  }
  catch (error) {
    console.error('Error creating expense', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
});

export const GET = withAuth(async (request: NextAuthRequest) => {
  try {
    const userId = request.auth!.user!.id;

    const expenses = await getExpenses(userId);

    return NextResponse.json(expenses);
  }
  catch (error) {
    console.error('Error getting expenses', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
});
