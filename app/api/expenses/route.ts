import dbConnect from '@/mongoose/client';
import Expense from '@/mongoose/models/Expense';
import { expenseSchema } from '@/schemas/expenseSchema';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = expenseSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.format() },
      { status: 400 }
    );
  }

  await dbConnect();

  const { description, price, quantity } = validation.data;
  const totalPrice = price * quantity;
  const expense = await Expense.create({
    description,
    price,
    quantity,
    totalPrice,
  });

  return NextResponse.json(expense, { status: 201 });
}
