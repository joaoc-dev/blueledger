import dbConnect from '@/lib/db/client';
import Expense from '@/models/expense.model';
import {
  deleteExpenseSchema,
  patchExpenseSchema,
} from '@/lib/validations/expense-schema';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validation = patchExpenseSchema.safeParse({ params: { id }, body });

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.format() },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingExpense = await Expense.findById(id);
    if (!existingExpense)
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });

    const updatedData = {
      ...existingExpense.toObject(),
      ...validation.data.body,
    };

    updatedData.totalPrice = updatedData.price * updatedData.quantity;

    const expense = await Expense.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.log('Error patching expense', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const validation = deleteExpenseSchema.safeParse({ params: { id } });

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.format() },
        { status: 400 }
      );
    }

    await dbConnect();

    const expense = await Expense.findByIdAndDelete(id);

    if (!expense)
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });

    return NextResponse.json(expense);
  } catch (error) {
    console.log('Error deleting expense', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
