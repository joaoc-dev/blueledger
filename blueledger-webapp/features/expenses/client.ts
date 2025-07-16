import { apiDelete, apiGet, apiPatch, apiPost } from '@/lib/api-client';
import {
  ExpenseApiResponse,
  ExpenseDisplay,
  ExpenseFormData,
} from '@/features/expenses/schemas';
import {
  mapApiResponseListToDisplay,
  mapApiResponseToDisplay,
  mapFormDataToApiRequest,
} from '@/features/expenses/expense-mapper';

export async function getExpenses(): Promise<ExpenseDisplay[]> {
  const response = await apiGet<ExpenseApiResponse[]>('/expenses');
  return mapApiResponseListToDisplay(response);
}

export async function getExpenseById(id: string): Promise<ExpenseDisplay> {
  const response = await apiGet<ExpenseApiResponse>(`/expenses/${id}`);
  return mapApiResponseToDisplay(response);
}

export async function createExpense(
  data: ExpenseFormData
): Promise<ExpenseDisplay> {
  const request = mapFormDataToApiRequest(data);
  const response = await apiPost<ExpenseApiResponse>('/expenses', request);
  return mapApiResponseToDisplay(response);
}

export async function updateExpense(
  id: string,
  data: ExpenseFormData
): Promise<ExpenseDisplay> {
  const request = mapFormDataToApiRequest(data);
  const response = await apiPatch<ExpenseApiResponse>(
    `/expenses/${id}`,
    request
  );
  return mapApiResponseToDisplay(response);
}

export async function deleteExpense(id: string): Promise<void> {
  await apiDelete(`/expenses/${id}`);
}
