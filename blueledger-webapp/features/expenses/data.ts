import Expense, { ExpenseDocument } from '@/features/expenses/model';
import dbConnect from '@/lib/db/mongoose-client';
import mongoose from 'mongoose';
import {
  CreateExpenseData,
  PatchExpenseData,
  ExpenseDisplay,
} from '@/features/expenses/schemas';

function toExpenseDisplay(expense: ExpenseDocument): ExpenseDisplay {
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

export async function getExpenses(): Promise<ExpenseDisplay[]> {
  await dbConnect();

  const expenses = await Expense.find();

  return expenses.map(toExpenseDisplay);
}

export async function createExpense(
  expense: CreateExpenseData
): Promise<ExpenseDisplay> {
  await dbConnect();

  const expenseModel: Partial<ExpenseDocument> = {
    ...expense,
    totalPrice: expense.price! * expense.quantity!,
  };

  const newExpense = await Expense.create(expenseModel);

  return toExpenseDisplay(newExpense);
}

export async function getExpenseById(
  id: string
): Promise<ExpenseDisplay | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  await dbConnect();

  const expense = await Expense.findById(id);

  return expense ? toExpenseDisplay(expense) : null;
}

export async function updateExpense(
  expense: PatchExpenseData
): Promise<ExpenseDisplay | null> {
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

  return updatedExpense ? toExpenseDisplay(updatedExpense) : null;
}

export async function deleteExpense(
  id: string
): Promise<ExpenseDisplay | null> {
  await dbConnect();

  const deletedExpense = await Expense.findByIdAndDelete(id);

  return deletedExpense ? toExpenseDisplay(deletedExpense) : null;
}
