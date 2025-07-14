import { withAuth } from '@/lib/api/withAuth';
import dbConnect from '@/lib/db/mongoose-client';
import {
  deleteExpenseSchema,
  patchExpenseSchema,
} from '@/lib/validations/expense-schema';
import Expense from '@/models/expense.model';
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

    const { error, data } = validateRequest(patchExpenseSchema, {
      params: { id },
      body,
    });

    if (error) return error;

    await dbConnect();

    const existingExpense = await Expense.findById(id);
    if (!existingExpense)
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });

    const updatedData = {
      ...existingExpense.toObject(),
      ...data!.body,
    };

    updatedData.totalPrice = updatedData.price * updatedData.quantity;

    const expense = await Expense.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

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

    const { error } = validateRequest(deleteExpenseSchema, {
      params: { id },
    });

    if (error) return error;

    await dbConnect();

    const expense = await Expense.findByIdAndDelete(id);

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
