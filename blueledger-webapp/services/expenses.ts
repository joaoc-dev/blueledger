// Expense service using Axios
import { api } from './api-client';
import type { ExpenseType } from '@/types/expense';
import { ExpenseFormData } from '@/lib/validations/expense-schema';

export async function getExpenses(groupId?: string): Promise<ExpenseType[]> {
  const params = groupId ? { groupId } : {};
  return api.get('/expenses', { params });
}

export async function getExpenseById(id: string): Promise<ExpenseType> {
  return api.get(`/expenses/${id}`);
}

export async function createExpense(
  data: ExpenseFormData
): Promise<ExpenseType> {
  return api.post('/expenses', data);
}

export async function updateExpense(
  id: string,
  data: ExpenseFormData
): Promise<ExpenseType> {
  return api.patch(`/expenses/${id}`, data);
}

export async function deleteExpense(id: string): Promise<void> {
  return api.delete(`/expenses/${id}`);
}
