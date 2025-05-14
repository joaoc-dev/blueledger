import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';

export async function POST(request: NextRequest) {
  await dbConnect();

  return NextResponse.json({ message: 'Expense created' }, { status: 201 });
}
