import type { CreateExpenseData, PatchExpenseData } from '../schemas';
import mongoose from 'mongoose';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { fullIntegrationTestHooks } from '@/tests/integration-setup/full-integration-setup';
import { EXPENSE_CATEGORIES } from '../constants';
import {
  createExpense,
  deleteExpense,
  getExpenseById,
  getExpenses,
  updateExpense,
} from '../data';

beforeAll(fullIntegrationTestHooks.beforeAll);
beforeEach(fullIntegrationTestHooks.beforeEach);
afterEach(fullIntegrationTestHooks.afterEach);
afterAll(fullIntegrationTestHooks.afterAll);

describe('expenses data - integration tests', () => {
  describe('getExpenses', () => {
    it('should get expenses for a user', async () => {
      const userId = new mongoose.Types.ObjectId();

      // Create test expenses
      await createExpense({
        data: {
          description: 'Coffee',
          price: 3.5,
          quantity: 1,
          category: EXPENSE_CATEGORIES.FOOD,
          date: new Date('2024-01-15T00:00:00.000Z'),
          user: userId.toString(),
        },
      } as CreateExpenseData);

      await createExpense({
        data: {
          description: 'Lunch',
          price: 12.0,
          quantity: 1,
          category: EXPENSE_CATEGORIES.FOOD,
          date: new Date('2024-01-16T00:00:00.000Z'),
          user: userId.toString(),
        },
      } as CreateExpenseData);

      const expenses = await getExpenses(userId.toString());
      expect(expenses.length).toBe(2);
    });

    it('should get expenses sorted by date descending', async () => {
      const userId = new mongoose.Types.ObjectId();

      // Create test expenses
      await createExpense({
        data: {
          description: 'Coffee',
          price: 3.5,
          quantity: 1,
          category: EXPENSE_CATEGORIES.FOOD,
          date: new Date('2024-01-15T00:00:00.000Z'),
          user: userId.toString(),
        },
      } as CreateExpenseData);

      await createExpense({
        data: {
          description: 'Lunch',
          price: 12.0,
          quantity: 1,
          category: EXPENSE_CATEGORIES.FOOD,
          date: new Date('2024-01-16T00:00:00.000Z'),
          user: userId.toString(),
        },
      } as CreateExpenseData);

      const expenses = await getExpenses(userId.toString());
      expect(expenses.length).toBe(2);
      expect(expenses[0]?.description).toBe('Lunch');
      expect(expenses[1]?.description).toBe('Coffee');
    });

    it('should not get expenses for a different user', async () => {
      const userId = new mongoose.Types.ObjectId();
      const differentUserId = new mongoose.Types.ObjectId();

      await createExpense({
        data: {
          description: 'Coffee',
          price: 3.5,
          quantity: 1,
          category: EXPENSE_CATEGORIES.FOOD,
          date: new Date('2024-01-15T00:00:00.000Z'),
          user: differentUserId.toString(),
        },
      } as CreateExpenseData);

      const expenses = await getExpenses(userId.toString());
      expect(expenses).toEqual([]);
    });

    it('should return empty array for user with no expenses', async () => {
      const userId = new mongoose.Types.ObjectId();
      const expenses = await getExpenses(userId.toString());
      expect(expenses).toEqual([]);
    });
  });

  describe('createExpense', () => {
    it('should create expense with calculated total price', async () => {
      const userId = new mongoose.Types.ObjectId();

      const expenseData: CreateExpenseData = {
        data: {
          description: 'Coffee',
          price: 3.5,
          quantity: 2,
          category: EXPENSE_CATEGORIES.FOOD,
          date: new Date('2024-01-15T00:00:00.000Z'),
          user: userId.toString(),
        },
      };

      const expense = await createExpense(expenseData);
      expect(expense).toBeDefined();
      expect(expense.id).toBeDefined();
      expect(expense.description).toBe('Coffee');
      expect(expense.price).toBe(3.5);
      expect(expense.quantity).toBe(2);
      expect(expense.totalPrice).toBe(7.0); // 3.5 * 2
      expect(expense.category).toBe(EXPENSE_CATEGORIES.FOOD);
    });

    it('should handle floating point precision correctly', async () => {
      const userId = new mongoose.Types.ObjectId();

      const expenseData: CreateExpenseData = {
        data: {
          description: 'Tiny math test',
          price: 0.1,
          quantity: 3,
          category: EXPENSE_CATEGORIES.OTHER,
          date: new Date(),
          user: userId.toString(),
        },
      };

      const expense = await createExpense(expenseData);

      // JS gives 0.30000000000000004, so use toBeCloseTo
      expect(expense.totalPrice).toBeCloseTo(0.3, 10);
    });
  });

  describe('getExpenseById', () => {
    it('should get expense by id', async () => {
      const userId = new mongoose.Types.ObjectId();
      const expense = await createExpense({
        data: {
          description: 'Coffee',
          price: 3.5,
          quantity: 1,
          category: EXPENSE_CATEGORIES.FOOD,
          date: new Date('2024-01-15T00:00:00.000Z'),
          user: userId.toString(),
        },
      } as CreateExpenseData);

      const found = await getExpenseById(expense.id!, userId.toString());
      expect(found).not.toBeNull();
      expect(found?.id).toBe(expense.id);
      expect(found?.description).toBe('Coffee');
      expect(found?.category).toBe(EXPENSE_CATEGORIES.FOOD);
    });

    it('should return null for non-existent expense', async () => {
      const userId = new mongoose.Types.ObjectId();
      const fakeId = new mongoose.Types.ObjectId().toString();
      const found = await getExpenseById(fakeId, userId.toString());
      expect(found).toBeNull();
    });

    it('should return null for invalid expense id', async () => {
      const userId = new mongoose.Types.ObjectId();
      const found = await getExpenseById('invalid-id', userId.toString());
      expect(found).toBeNull();
    });
  });

  describe('updateExpense', () => {
    it('should update expense and recalculate total price', async () => {
      const userId = new mongoose.Types.ObjectId();

      const created = await createExpense({
        data: {
          description: 'Original Item',
          price: 10.0,
          quantity: 1,
          category: EXPENSE_CATEGORIES.FOOD,
          date: new Date('2024-01-15T00:00:00.000Z'),
          user: userId.toString(),
        },
      } as CreateExpenseData);

      const updated = await updateExpense({
        id: created.id!,
        data: {
          description: 'Updated Item',
          price: 15.0,
          quantity: 3,
        },
      } as PatchExpenseData, userId.toString());

      expect(updated).not.toBeNull();
      expect(updated?.id).toBe(created.id);
      expect(updated?.description).toBe('Updated Item');
      expect(updated?.price).toBe(15.0);
      expect(updated?.quantity).toBe(3);
      expect(updated?.totalPrice).toBe(45.0); // 15.0 * 3
    });

    it('should return null when updating non-existent expense', async () => {
      const userId = new mongoose.Types.ObjectId();
      const fakeId = new mongoose.Types.ObjectId().toString();

      const updated = await updateExpense({
        id: fakeId,
        data: { description: 'New Description' },
      } as PatchExpenseData, userId.toString());

      expect(updated).toBeNull();
    });
  });

  describe('deleteExpense', () => {
    it('should delete expense', async () => {
      const userId = new mongoose.Types.ObjectId();
      const created = await createExpense({
        data: {
          description: 'Item to Delete',
          price: 5.0,
          quantity: 1,
          category: EXPENSE_CATEGORIES.FOOD,
          date: new Date('2024-01-15T00:00:00.000Z'),
          user: userId.toString(),
        },
      } as CreateExpenseData);

      const deleted = await deleteExpense(created.id!, userId.toString());
      expect(deleted).not.toBeNull();
      expect(deleted?.id).toBe(created.id);
      expect(deleted?.description).toBe('Item to Delete');

      // Verify it's actually deleted
      const found = await getExpenseById(created.id!, userId.toString());
      expect(found).toBeNull();
    });

    it('should return null when deleting non-existent expense', async () => {
      const userId = new mongoose.Types.ObjectId();
      const fakeId = new mongoose.Types.ObjectId().toString();
      const deleted = await deleteExpense(fakeId, userId.toString());
      expect(deleted).toBeNull();
    });
  });
});
