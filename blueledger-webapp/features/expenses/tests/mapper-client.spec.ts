import type { ExpenseApiResponse, ExpenseFormData } from '../schemas';
import { describe, expect, it } from 'vitest';
import { EXPENSE_CATEGORIES } from '../constants';
import { mapApiResponseListToDisplay, mapApiResponseToDisplay, mapFormDataToApiRequest } from '../mapper-client';

describe('mapper-client', () => {
  const apiResponse: ExpenseApiResponse = {
    id: '1',
    user: { id: 'u1' },
    description: 'Lunch',
    price: 10,
    quantity: 2,
    totalPrice: 20,
    category: 'Food',
    date: '2025-01-01T00:00:00.000Z',
    createdAt: '2025-01-02T00:00:00.000Z',
    updatedAt: '2025-01-03T00:00:00.000Z',
  };

  describe('mapApiResponseToDisplay', () => {
    it('converts date strings to Date objects', () => {
      const display = mapApiResponseToDisplay(apiResponse);
      expect(display.date).toBeInstanceOf(Date);
      expect(display.createdAt).toBeInstanceOf(Date);
      expect(display.updatedAt).toBeInstanceOf(Date);

      expect(display.date.toISOString()).toBe(apiResponse.date);
      expect(display.createdAt.toISOString()).toBe(apiResponse.createdAt);
      expect(display.updatedAt.toISOString()).toBe(apiResponse.updatedAt);
    });
  });

  describe('mapFormDataToApiRequest', () => {
    it('converts Date to ISO string', () => {
      const formData: ExpenseFormData = {
        description: 'Lunch',
        price: 10,
        quantity: 2,
        category: EXPENSE_CATEGORIES.FOOD,
        date: new Date('2025-01-01T00:00:00.000Z'),
      };

      const request = mapFormDataToApiRequest(formData);
      expect(typeof request.date).toBe('string');
      expect(request.date).toBe(formData.date.toISOString());
    });
  });

  describe('mapApiResponseListToDisplay', () => {
    it('maps an array of responses correctly', () => {
      const list = [apiResponse, apiResponse];

      const displayList = mapApiResponseListToDisplay(list);

      expect(displayList).toHaveLength(2);
      displayList.forEach((d, i) => {
        expect(d).toHaveProperty('id', list[i]?.id);
        expect(d.date).toBeInstanceOf(Date);
        expect(d.createdAt).toBeInstanceOf(Date);
        expect(d.updatedAt).toBeInstanceOf(Date);
      });
    });
  });
});
