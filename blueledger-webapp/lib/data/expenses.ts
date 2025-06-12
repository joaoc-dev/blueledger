import { ExpenseType } from '@/types/expense';
import Expense, { ExpenseDocument } from '@/models/expense.model';
import dbConnect from '../db/client';
import mongoose from 'mongoose';

function transformExpense(expense: ExpenseDocument): ExpenseType {
  const { _id, ...rest } = expense.toObject ? expense.toObject() : expense;
  return {
    ...rest,
    id: _id?.toString(),
  };
}

export async function getExpenses(): Promise<ExpenseType[]> {
  await dbConnect();

  const expenses = await Expense.find();

  return expenses.map(transformExpense);
}

export async function getExpenseById(id: string): Promise<ExpenseType | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  await dbConnect();

  const expense = await Expense.findById(id);

  return expense ? transformExpense(expense) : null;
}
