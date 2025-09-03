import type { ExpenseDocument } from './models';
import type { CreateExpenseData, ExpenseDisplay, PatchExpenseData } from './schemas';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db/mongoose-client';
import { mapModelToDisplay } from './mapper-server';
import Expense from './models';

export async function getExpenses(userId: string): Promise<ExpenseDisplay[]> {
  await dbConnect();

  const expenses = await Expense.find({ user: userId }).sort({ date: -1 });

  return expenses.map(mapModelToDisplay);
}

export async function createExpense(
  expense: CreateExpenseData,
): Promise<ExpenseDisplay> {
  await dbConnect();

  const expenseModel: Partial<ExpenseDocument> = {
    ...expense.data,
    totalPrice: expense.data.price! * expense.data.quantity!,
  };

  const newExpense = await Expense.create(expenseModel);

  return mapModelToDisplay(newExpense);
}

export async function getExpenseById(
  id: string,
  userId: string,
): Promise<ExpenseDisplay | null> {
  if (!mongoose.Types.ObjectId.isValid(id))
    return null;

  await dbConnect();

  const expense = await Expense.findOne({ _id: id, user: userId });

  return expense ? mapModelToDisplay(expense) : null;
}

export async function updateExpense(
  expense: PatchExpenseData,
  userId: string,
): Promise<ExpenseDisplay | null> {
  await dbConnect();

  const existing = await Expense.findOne({ _id: expense.id, user: userId });
  if (!existing)
    return null;

  const updatedData = {
    ...existing.toObject(),
    ...expense.data,
  };

  updatedData.totalPrice = updatedData.price! * updatedData.quantity!;

  const updatedExpense = await Expense.findByIdAndUpdate(
    expense.id,
    updatedData,
    { new: true },
  );

  return updatedExpense ? mapModelToDisplay(updatedExpense) : null;
}

export async function deleteExpense(
  id: string,
  userId: string,
): Promise<ExpenseDisplay | null> {
  await dbConnect();

  const deletedExpense = await Expense.findOneAndDelete({
    _id: id,
    user: userId,
  });

  return deletedExpense ? mapModelToDisplay(deletedExpense) : null;
}
