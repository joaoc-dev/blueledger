import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/mongoose/client';
import Expense from '@/mongoose/models/Expense';

export async function POST(request: NextRequest) {
  await dbConnect();

  const { description, price, quantity, totalPrice } = await request.json();

  const expense = await Expense.create({
    description,
    price,
    quantity,
    totalPrice,
  });

  return NextResponse.json(expense, { status: 201 });
}
