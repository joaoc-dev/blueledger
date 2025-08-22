import mongoose from 'mongoose';
import { describe, expect, it } from 'vitest';
import { EXPENSE_CATEGORIES } from '../constants';
import { mapModelToDisplay } from '../mapper-server';

const modelId = new mongoose.Types.ObjectId().toString();
const userId = new mongoose.Types.ObjectId().toString();

describe('mapper-server', () => {
  const model: any = {
    _id: { toString: () => modelId },
    description: 'Dinner',
    price: 15,
    quantity: 1,
    totalPrice: 15,
    category: EXPENSE_CATEGORIES.FOOD,
    date: new Date('2025-01-05T00:00:00.000Z'),
    user: { toString: () => userId },
    createdAt: new Date('2025-01-06T00:00:00.000Z'),
    updatedAt: new Date('2025-01-07T00:00:00.000Z'),
    toObject() { return this; },
  };

  describe('mapModelToDisplay', () => {
    it('converts _id to string id', () => {
      const display = mapModelToDisplay(model);
      expect(display.id).toBe(modelId);
    });

    it('maps user ObjectId to { id: string }', () => {
      const display = mapModelToDisplay(model);
      expect(display.user).toEqual({ id: userId });
    });

    it('copies over fields correctly', () => {
      const display = mapModelToDisplay(model);
      expect(display.description).toBe('Dinner');
      expect(display.price).toBe(15);
      expect(display.quantity).toBe(1);
      expect(display.totalPrice).toBe(15);
      expect(display.date).toBeInstanceOf(Date);
      expect(display.category).toBe(EXPENSE_CATEGORIES.FOOD);
      expect(display.createdAt).toBeInstanceOf(Date);
      expect(display.updatedAt).toBeInstanceOf(Date);
    });
  });
});
