import { apiDelete, apiGet, apiPatch, apiPost } from '../api-client';
import type { ExpenseType } from '@/types/expense';
import { ExpenseFormData } from '@/lib/validations/expense-schema';
import { ExpenseMapper, type ExpenseApiResponse } from './expense-mapper';

export async function getExpenses(groupId?: string): Promise<ExpenseType[]> {
  const params = groupId ? { groupId } : {};
  const response = await apiGet<ExpenseApiResponse[]>('/expenses', {
    params,
  });

  return ExpenseMapper.toTypeList(response);
}

export async function getExpenseById(id: string): Promise<ExpenseType> {
  const response = await apiGet<ExpenseApiResponse>(`/expenses/${id}`);
  return ExpenseMapper.toType(response);
}

export async function createExpense(
  data: ExpenseFormData
): Promise<ExpenseType> {
  const request = ExpenseMapper.toApiRequest(data);
  const response = await apiPost<ExpenseApiResponse>('/expenses', request);
  return ExpenseMapper.toType(response);
}

export async function updateExpense(
  id: string,
  data: ExpenseFormData
): Promise<ExpenseType> {
  const request = ExpenseMapper.toApiRequest(data);
  const response = await apiPatch<ExpenseApiResponse>(
    `/expenses/${id}`,
    request
  );
  return ExpenseMapper.toType(response);
}

export async function deleteExpense(id: string): Promise<void> {
  await apiDelete(`/expenses/${id}`);
}
