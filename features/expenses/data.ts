import type { ExpenseDocument } from './models';
import type { CreateExpenseData, ExpenseDisplay, PatchExpenseData } from './schemas';
import mongoose from 'mongoose';
import { generateTextEmbedding } from '@/lib/ai/embeddings';
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

  // Generate embedding only if description is present
  try {
    if (expenseModel.description)
      expenseModel.embedding = await generateTextEmbedding(expenseModel.description);
  }
  catch {
    // Best effort embedding; continue without blocking create
    expenseModel.embedding = [];
  }

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

  // Re-embed only when description value actually differs
  if (expense.data.description !== undefined && expense.data.description !== existing.description) {
    try {
      updatedData.embedding = await generateTextEmbedding(expense.data.description);
    }
    catch {
      // keep previous embedding on failure
      updatedData.embedding = existing.embedding;
    }
  }

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

export interface TotalSpentArgs {
  userId: string;
  startDate?: Date;
  endDate?: Date;
  category?: string;
}

export async function getTotalSpentForUser(args: TotalSpentArgs): Promise<number> {
  const { userId, startDate, endDate, category } = args;
  console.warn('getTotalSpentForUser', args);
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(userId))
    return 0;

  const userObjectId = new mongoose.Types.ObjectId(userId);

  const match: Record<string, any> = { user: userObjectId };
  if (startDate || endDate) {
    match.date = {} as any;
    if (startDate)
      match.date.$gte = startDate;
    if (endDate)
      match.date.$lte = endDate;
  }
  if (category)
    match.category = category;

  const result = await Expense.aggregate([
    { $match: match },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]).exec();

  console.warn('result', result);
  return (result?.[0]?.total as number | undefined) ?? 0;
}

export interface CategoryTotalsArgs {
  userId: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}

export async function getTotalsByCategoryForUser(
  args: CategoryTotalsArgs,
): Promise<Array<{ category: string; total: number }>> {
  const { userId, startDate, endDate, limit = 5 } = args;
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(userId))
    return [];

  const userObjectId = new mongoose.Types.ObjectId(userId);

  const match: Record<string, any> = { user: userObjectId };
  if (startDate || endDate) {
    match.date = {} as any;
    if (startDate)
      match.date.$gte = startDate;
    if (endDate)
      match.date.$lte = endDate;
  }

  const result = await Expense.aggregate([
    { $match: match },
    { $group: { _id: '$category', total: { $sum: '$totalPrice' } } },
    { $sort: { total: -1 } },
    { $limit: limit },
  ]).exec();

  return result.map(r => ({ category: r._id as string, total: r.total as number }));
}

// Additional analytics/data queries for chatbot tools

export interface RecentExpensesArgs {
  userId: string;
  limit?: number;
}

export async function getRecentExpensesForUser(
  args: RecentExpensesArgs,
) {
  const { userId, limit = 10 } = args;
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(userId))
    return [];

  const expenses = await Expense
    .find({ user: new mongoose.Types.ObjectId(userId) })
    .sort({ date: -1 })
    .limit(Math.max(1, Math.min(50, limit)))
    .exec();

  return expenses.map(mapModelToDisplay);
}

export interface LargestExpensesArgs {
  userId: string;
  startDate?: Date;
  endDate?: Date;
  category?: string;
  limit?: number;
}

export async function getLargestExpensesForUser(
  args: LargestExpensesArgs,
) {
  const { userId, startDate, endDate, category, limit = 5 } = args;
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(userId))
    return [];

  const match: Record<string, any> = { user: new mongoose.Types.ObjectId(userId) };
  if (startDate || endDate) {
    match.date = {} as any;
    if (startDate)
      match.date.$gte = startDate;
    if (endDate)
      match.date.$lte = endDate;
  }
  if (category)
    match.category = category;

  const expenses = await Expense
    .find(match)
    .sort({ totalPrice: -1 })
    .limit(Math.max(1, Math.min(50, limit)))
    .exec();

  return expenses.map(mapModelToDisplay);
}

export type TimeSeriesInterval = 'day' | 'week' | 'month';

export interface SpendingTimeSeriesArgs {
  userId: string;
  startDate?: Date;
  endDate?: Date;
  interval?: TimeSeriesInterval;
}

export async function getSpendingTimeSeriesForUser(
  args: SpendingTimeSeriesArgs,
): Promise<Array<{ periodStart: Date; total: number }>> {
  const { userId, startDate, endDate, interval = 'day' } = args;
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(userId))
    return [];

  const userObjectId = new mongoose.Types.ObjectId(userId);

  const match: Record<string, any> = { user: userObjectId };
  if (startDate || endDate) {
    match.date = {} as any;
    if (startDate)
      match.date.$gte = startDate;
    if (endDate)
      match.date.$lte = endDate;
  }

  // Use $dateTrunc to bucket by interval
  const result = await Expense.aggregate([
    { $match: match },
    {
      $group: {
        _id: { $dateTrunc: { date: '$date', unit: interval } },
        total: { $sum: '$totalPrice' },
      },
    },
    { $sort: { _id: 1 } },
  ]).exec();

  return (result as Array<{ _id: Date; total: number }>).map(r => ({ periodStart: r._id, total: r.total }));
}

export interface ExpensesCountArgs {
  userId: string;
  startDate?: Date;
  endDate?: Date;
  category?: string;
}

export async function getExpensesCountForUser(args: ExpensesCountArgs): Promise<number> {
  const { userId, startDate, endDate, category } = args;
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(userId))
    return 0;

  const filter: Record<string, any> = { user: new mongoose.Types.ObjectId(userId) };
  if (startDate || endDate) {
    filter.date = {} as any;
    if (startDate)
      filter.date.$gte = startDate;
    if (endDate)
      filter.date.$lte = endDate;
  }
  if (category)
    filter.category = category;

  return Expense.countDocuments(filter).exec();
}

export interface AverageDailySpendArgs {
  userId: string;
  startDate?: Date;
  endDate?: Date;
}

export async function getAverageDailySpendForUser(
  args: AverageDailySpendArgs,
): Promise<{ average: number; days: number; total: number }> {
  const { userId } = args;
  let { startDate, endDate } = args;
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(userId))
    return { average: 0, days: 0, total: 0 };

  // Default window to last 30 days if not provided
  if (!endDate)
    endDate = new Date();
  if (!startDate) {
    const d = new Date(endDate);
    d.setDate(d.getDate() - 29);
    startDate = d;
  }

  const total = await getTotalSpentForUser({ userId, startDate, endDate });

  // Compute inclusive day span
  const start = new Date(startDate);
  const end = new Date(endDate);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

  return { average: total / days, days, total };
}

export interface SearchExpensesArgs {
  userId: string;
  query: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}

export async function searchExpensesByDescriptionForUser(
  args: SearchExpensesArgs,
) {
  const { userId, query, startDate, endDate, limit = 10 } = args;
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(userId))
    return [];

  const match: Record<string, any> = { user: new mongoose.Types.ObjectId(userId) };
  if (startDate || endDate) {
    match.date = {} as any;
    if (startDate)
      match.date.$gte = startDate;
    if (endDate)
      match.date.$lte = endDate;
  }

  const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const expenses = await Expense
    .find({
      ...match,
      description: { $regex: escapeRegex(query), $options: 'i' },
    })
    .sort({ date: -1 })
    .limit(Math.max(1, Math.min(50, limit)))
    .exec();

  return expenses.map(mapModelToDisplay);
}
