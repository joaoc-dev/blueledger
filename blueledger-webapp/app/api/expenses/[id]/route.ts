import { deleteExpense, updateExpense } from '@/features/expenses/data';
import {
  deleteExpenseSchema,
  patchExpenseSchema,
} from '@/features/expenses/schemas';
import { withAuth } from '@/lib/api/withAuth';
import { NextAuthRequest } from 'next-auth';
import { NextResponse } from 'next/server';
import { validateRequest } from '../../validateRequest';

export const PATCH = withAuth(async function PATCH(
  request: NextAuthRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const validationResult = validateRequest(patchExpenseSchema, {
      id,
      data: body,
    });
    if (!validationResult.success) return validationResult.error;

    const userId = request.auth!.user!.id;
    const expense = await updateExpense(validationResult.data!, userId);
    if (!expense)
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });

    return NextResponse.json(expense, { status: 200 });
  } catch (error) {
    console.log('Error patching expense', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
});

export const DELETE = withAuth(async function DELETE(
  request: NextAuthRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const validationResult = validateRequest(deleteExpenseSchema, {
      id,
    });
    if (!validationResult.success) return validationResult.error;

    const userId = request.auth!.user!.id;
    const expense = await deleteExpense(id, userId);

    if (!expense)
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });

    return NextResponse.json(expense, { status: 200 });
  } catch (error) {
    console.log('Error deleting expense', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
});
