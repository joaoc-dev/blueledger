import { ExpenseType } from '@/types/expense';
import Expense, { ExpenseDocument } from '@/models/expense.model';
import dbConnect from '@/lib/db/mongoose-client';
import mongoose from 'mongoose';

function toExpenseType(expense: ExpenseDocument): ExpenseType {
  const { _id, _v, user, ...rest } = expense.toObject
    ? expense.toObject()
    : expense;
  return {
    ...rest,
    id: _id?.toString(),
  };
}

function toExpenseModel(expense: Partial<ExpenseType>): ExpenseDocument {
  const { user, ...rest } = expense;

  const expenseModel = {
    ...rest,
    user: user?.id,
  };
  return new Expense(expenseModel);
}

export async function getExpenses(): Promise<ExpenseType[]> {
  await dbConnect();

  const expenses = await Expense.find();

  return expenses.map(toExpenseType);
}

export async function getExpenseById(id: string): Promise<ExpenseType | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  await dbConnect();

  const expense = await Expense.findById(id);

  return expense ? toExpenseType(expense) : null;
}

export async function createExpense(
  expense: Partial<ExpenseType>
): Promise<ExpenseType> {
  await dbConnect();

  const expenseModel = toExpenseModel(expense);

  const newExpense = await Expense.create(expenseModel);

  return toExpenseType(newExpense);
}

export async function updateExpense(
  expense: Partial<ExpenseType>
): Promise<ExpenseType | null> {
  await dbConnect();

  const updatedExpense = await Expense.findByIdAndUpdate(expense.id, expense, {
    new: true,
  });

  return updatedExpense ? toExpenseType(updatedExpense) : null;
}

export async function deleteExpense(id: string): Promise<ExpenseType | null> {
  await dbConnect();

  const deletedExpense = await Expense.findByIdAndDelete(id);

  return deletedExpense ? toExpenseType(deletedExpense) : null;
}
