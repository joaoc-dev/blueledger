import { ExpenseType } from '@/types/expense';
import Expense, { ExpenseDocument } from '@/features/expenses/model';
import dbConnect from '@/lib/db/mongoose-client';
import mongoose from 'mongoose';
import {
  CreateExpenseData,
  PatchExpenseData,
} from '@/features/expenses/schemas';

function toExpenseType(expense: ExpenseDocument): ExpenseType {
  const obj = expense.toObject();
  return {
    id: obj._id.toString(),
    description: obj.description,
    price: obj.price,
    quantity: obj.quantity,
    totalPrice: obj.totalPrice,
    category: obj.category,
    date: obj.date,
    user: { id: obj.user.toString() },
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
}

export async function getExpenses(): Promise<ExpenseType[]> {
  await dbConnect();

  const expenses = await Expense.find();

  return expenses.map(toExpenseType);
}

export async function createExpense(
  expense: CreateExpenseData
): Promise<ExpenseType> {
  await dbConnect();

  const expenseModel: Partial<ExpenseDocument> = {
    ...expense,
    totalPrice: expense.price! * expense.quantity!,
  };

  const newExpense = await Expense.create(expenseModel);

  return toExpenseType(newExpense);
}

export async function getExpenseById(id: string): Promise<ExpenseType | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  await dbConnect();

  const expense = await Expense.findById(id);

  return expense ? toExpenseType(expense) : null;
}

export async function updateExpense(
  expense: PatchExpenseData
): Promise<ExpenseType | null> {
  await dbConnect();

  const existing = await Expense.findById(expense.params.id);
  if (!existing) return null;

  const updatedData = {
    ...existing.toObject(),
    ...expense.body,
  };

  updatedData.totalPrice = updatedData.price! * updatedData.quantity!;

  const updatedExpense = await Expense.findByIdAndUpdate(
    expense.params.id,
    updatedData,
    { new: true }
  );

  return updatedExpense ? toExpenseType(updatedExpense) : null;
}

export async function deleteExpense(id: string): Promise<ExpenseType | null> {
  await dbConnect();

  const deletedExpense = await Expense.findByIdAndDelete(id);

  return deletedExpense ? toExpenseType(deletedExpense) : null;
}
