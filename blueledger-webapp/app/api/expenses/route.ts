import dbConnect from '@/lib/db/client';
import Expense from '@/models/expense.model';
import { expenseSchema } from '@/lib/validations/expense-schema';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
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
  } catch (error) {
    console.log('Error creating expense', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
