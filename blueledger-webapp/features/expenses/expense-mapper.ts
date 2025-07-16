import type { ExpenseType } from '@/types/expense';
import { ExpenseFormData } from '@/features/expenses/schemas';
import type { ExpenseCategory } from '@/constants/expense-category';

// export interface ExpenseApiResponse {
//   id: string;
//   description: string;
//   price: number;
//   quantity: number;
//   totalPrice: number;
//   category: ExpenseCategory;
//   date: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface ExpenseApiRequest {
//   description: string;
//   price: number;
//   quantity: number;
//   category: ExpenseCategory;
//   date: string;
// }

export class ExpenseMapper {
  static toType(apiResponse: any): ExpenseType {
    return {
      ...apiResponse,
      date: new Date(apiResponse.date),
      createdAt: new Date(apiResponse.createdAt),
      updatedAt: new Date(apiResponse.updatedAt),
    };
  }

  static toApiRequest(data: ExpenseFormData): any {
    return {
      ...data,
      date: data.date.toISOString(),
    };
  }

  static toTypeList(apiResponses: any[]): ExpenseType[] {
    return apiResponses.map(this.toType);
  }
}
