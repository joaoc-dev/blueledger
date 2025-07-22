import { ExpenseDisplay, ExpenseFormData, ExpenseApiResponse } from './schemas';

export function mapApiResponseToDisplay(
  apiResponse: ExpenseApiResponse
): ExpenseDisplay {
  return {
    ...apiResponse,
    date: new Date(apiResponse.date),
    createdAt: new Date(apiResponse.createdAt),
    updatedAt: new Date(apiResponse.updatedAt),
  };
}

export function mapFormDataToApiRequest(data: ExpenseFormData): any {
  return {
    ...data,
    date: data.date.toISOString(),
  };
}

export function mapApiResponseListToDisplay(
  apiResponses: ExpenseApiResponse[]
): ExpenseDisplay[] {
  return apiResponses.map(mapApiResponseToDisplay);
}
