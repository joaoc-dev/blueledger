import type { ExpenseApiResponse, ExpenseDisplay, ExpenseFormData } from './schemas';
import { apiDelete, apiGet, apiPatch, apiPost } from '@/lib/api-client';
import {
  mapApiResponseListToDisplay,
  mapApiResponseToDisplay,
  mapFormDataToApiRequest,
} from './mapper-client';

const endpoint = '/expenses';

export async function getExpenses(): Promise<ExpenseDisplay[]> {
  const response = await apiGet<ExpenseApiResponse[]>(endpoint);
  return mapApiResponseListToDisplay(response);
}

export async function getExpenseById(id: string): Promise<ExpenseDisplay> {
  const response = await apiGet<ExpenseApiResponse>(`${endpoint}/${id}`);
  return mapApiResponseToDisplay(response);
}

export async function createExpense(
  data: ExpenseFormData,
): Promise<ExpenseDisplay> {
  const request = mapFormDataToApiRequest(data);
  const response = await apiPost<ExpenseApiResponse>(endpoint, request);
  return mapApiResponseToDisplay(response);
}

export async function updateExpense(
  id: string,
  data: ExpenseFormData,
): Promise<ExpenseDisplay> {
  const request = mapFormDataToApiRequest(data);
  const response = await apiPatch<ExpenseApiResponse>(
    `${endpoint}/${id}`,
    request,
  );
  return mapApiResponseToDisplay(response);
}

export async function deleteExpense(id: string): Promise<void> {
  await apiDelete(`${endpoint}/${id}`);
}
