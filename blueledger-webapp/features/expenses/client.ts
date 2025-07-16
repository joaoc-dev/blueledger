import { apiDelete, apiGet, apiPatch, apiPost } from '@/lib/api-client';
import type { ExpenseType } from '@/types/expense';
import { ExpenseFormData } from '@/features/expenses/schemas';
import { ExpenseMapper } from '@/features/expenses/expense-mapper';

export async function getExpenses(): Promise<ExpenseType[]> {
  const response = await apiGet<any[]>('/expenses');
  return ExpenseMapper.toTypeList(response);
}

export async function getExpenseById(id: string): Promise<ExpenseType> {
  const response = await apiGet<any>(`/expenses/${id}`);
  return ExpenseMapper.toType(response);
}

export async function createExpense(
  data: ExpenseFormData
): Promise<ExpenseType> {
  const request = ExpenseMapper.toApiRequest(data);
  const response = await apiPost<any>('/expenses', request);
  return ExpenseMapper.toType(response);
}

export async function updateExpense(
  id: string,
  data: ExpenseFormData
): Promise<ExpenseType> {
  const request = ExpenseMapper.toApiRequest(data);
  const response = await apiPatch<any>(`/expenses/${id}`, request);
  return ExpenseMapper.toType(response);
}

export async function deleteExpense(id: string): Promise<void> {
  await apiDelete(`/expenses/${id}`);
}
