import dbConnect from '@/lib/db/mongoose-client';
import mongoose from 'mongoose';
import { mapModelToDisplay } from './mapper-server';
import Expense, { ExpenseDocument } from './model';
import { CreateExpenseData, ExpenseDisplay, PatchExpenseData } from './schemas';

export async function getExpenses(): Promise<ExpenseDisplay[]> {
  await dbConnect();

  const expenses = await Expense.find();

  return expenses.map(mapModelToDisplay);
}

export async function createExpense(
  expense: CreateExpenseData
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
  id: string
): Promise<ExpenseDisplay | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  await dbConnect();

  const expense = await Expense.findById(id);

  return expense ? mapModelToDisplay(expense) : null;
}

export async function updateExpense(
  expense: PatchExpenseData
): Promise<ExpenseDisplay | null> {
  await dbConnect();

  const existing = await Expense.findById(expense.id);
  if (!existing) return null;

  const updatedData = {
    ...existing.toObject(),
    ...expense.data,
  };

  updatedData.totalPrice = updatedData.price! * updatedData.quantity!;

  const updatedExpense = await Expense.findByIdAndUpdate(
    expense.id,
    updatedData,
    { new: true }
  );

  return updatedExpense ? mapModelToDisplay(updatedExpense) : null;
}

export async function deleteExpense(
  id: string
): Promise<ExpenseDisplay | null> {
  await dbConnect();

  const deletedExpense = await Expense.findByIdAndDelete(id);

  return deletedExpense ? mapModelToDisplay(deletedExpense) : null;
}
