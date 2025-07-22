import { createExpense, getExpenses } from '@/features/expenses/data';
import { createExpenseSchema } from '@/features/expenses/schemas';
import { withAuth } from '@/lib/api/withAuth';
import { NextAuthRequest } from 'next-auth';
import { NextResponse } from 'next/server';
import { validateRequest } from '../validateRequest';

export const POST = withAuth(async function POST(request: NextAuthRequest) {
  try {
    const body = await request.json();
    const userId = request.auth!.user!.id;

    const validationResult = validateRequest(createExpenseSchema, {
      data: {
        ...body,
        user: userId,
      },
    });
    if (!validationResult.success) return validationResult.error;

    const expense = await createExpense(validationResult.data!);

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
