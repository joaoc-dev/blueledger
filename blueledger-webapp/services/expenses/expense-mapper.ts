import type { ExpenseType } from '@/types/expense';
import { ExpenseFormData } from '@/lib/validations/expense-schema';
import type { ExpenseCategory } from '@/constants/expense-category';

export interface ExpenseApiResponse {
  id: string;
  description: string;
  price: number;
  quantity: number;
  totalPrice: number;
  category: ExpenseCategory;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseApiRequest {
  description: string;
  price: number;
  quantity: number;
  category: ExpenseCategory;
  date: string;
}

export class ExpenseMapper {
  static toType(apiResponse: ExpenseApiResponse): ExpenseType {
    return {
      ...apiResponse,
      date: new Date(apiResponse.date),
      createdAt: new Date(apiResponse.createdAt),
      updatedAt: new Date(apiResponse.updatedAt),
    };
  }

  static toApiRequest(data: ExpenseFormData): ExpenseApiRequest {
    return {
      ...data,
      date: data.date.toISOString(),
    };
  }

  static toTypeList(apiResponses: ExpenseApiResponse[]): ExpenseType[] {
    return apiResponses.map(this.toType);
  }
}
