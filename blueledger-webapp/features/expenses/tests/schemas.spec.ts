import type {
  CreateExpenseData,
} from '../schemas';
import { Types } from 'mongoose';
import { beforeEach, describe, expect, it } from 'vitest';
import { EXPENSE_CATEGORIES } from '../constants';
import {
  createExpenseSchema,
  deleteExpenseSchema,
  patchExpenseSchema,
} from '../schemas';

const validObjectId = new Types.ObjectId().toHexString();

describe('expenses schemas', () => {
  let validData: any;

  beforeEach(() => {
    validData = {
      data: {
        description: 'Lunch',
        price: 10,
        quantity: 1,
        category: EXPENSE_CATEGORIES.FOOD,
        date: new Date().toISOString(),
        user: validObjectId,
      },
    };
  });

  describe('createExpenseSchema', () => {
    it('should accept valid data', () => {
      expect(() => createExpenseSchema.parse(validData)).not.toThrow();
    });

    it('should reject invalid user ID', () => {
      const data: CreateExpenseData = {
        data: { ...validData.data, user: 'bad' },
      };

      expect(() => createExpenseSchema.parse(data)).toThrow();
    });

    it('should reject invalid date string', () => {
      const data: CreateExpenseData = {
        data: { ...validData.data, date: 'not-a-date' },
      };

      expect(() => createExpenseSchema.parse(data)).toThrow();
    });

    it('should require description', () => {
      const data: CreateExpenseData = {
        data: { ...validData.data, description: '' },
      };

      expect(() => createExpenseSchema.parse(data)).toThrow();
    });

    it('should reject too long description', () => {
      const data: CreateExpenseData = {
        data: { ...validData.data, description: 'a'.repeat(201) },
      };

      expect(() => createExpenseSchema.parse(data)).toThrow();
    });

    it('should require positive price', () => {
      const data: CreateExpenseData = {
        data: { ...validData.data, price: -1 },
      };

      expect(() => createExpenseSchema.parse(data)).toThrow();
    });

    it('should require positive quantity', () => {
      const data: CreateExpenseData = {
        data: { ...validData.data, quantity: -1 },
      };

      expect(() => createExpenseSchema.parse(data)).toThrow();
    });

    it('should require a valid category', () => {
      const data: CreateExpenseData = {
        data: { ...validData.data, category: 'WRONG_CATEGORY' as any },
      };

      expect(() => createExpenseSchema.parse(data)).toThrow();
    });
  });

  describe('patchExpenseSchema', () => {
    it('patchExpenseSchema requires valid id and at least one field', () => {
      expect(() => patchExpenseSchema.parse({ id: 'invalid', data: {} })).toThrow();
      expect(() => patchExpenseSchema.parse({ id: validObjectId, data: {} })).toThrow();
      expect(() => patchExpenseSchema.parse({ id: validObjectId, data: { description: 'x' } })).not.toThrow();
    });
  });

  describe('deleteExpenseSchema', () => {
    it('should validate id', () => {
      expect(() => deleteExpenseSchema.parse({ id: validObjectId })).not.toThrow();
      expect(() => deleteExpenseSchema.parse({ id: 'bad' })).toThrow();
    });
  });
});
