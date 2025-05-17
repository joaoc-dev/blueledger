import dbConnect from '@/mongoose/client';
import Expense from '@/mongoose/models/Expense';
import { deleteExpenseSchema } from '@/schemas/expenseSchema';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
}
