import mongoose from 'mongoose';
import { http, HttpResponse } from 'msw';
import { afterEach, describe, expect } from 'vitest';
import { db } from '@/tests/mocks/db';
import { test } from '@/tests/test-extend';
import { createExpense, deleteExpense, getExpenses, updateExpense } from '../client';
import { EXPENSE_CATEGORIES } from '../constants';

describe('expenses client (browser)', () => {
  // Clean up after each test to ensure isolation
  afterEach(() => {
    db.expense.deleteMany({ where: {} });
  });

  describe('get expenses', () => {
    test('should get expenses list', async () => {
      db.expense.create({
        description: 'Test Coffee',
        price: 3,
        quantity: 1,
        totalPrice: 3,
        category: EXPENSE_CATEGORIES.FOOD,
        date: new Date('2024-02-01T00:00:00.000Z').toISOString(),
        user: new mongoose.Types.ObjectId().toString(),
      });

      const expenses = await getExpenses();
      expect(expenses).toBeDefined();
      expect(expenses).toHaveLength(1);
      expect(expenses[0]!.description).toBe('Test Coffee');
      expect(expenses[0]!.price).toBe(3);
      expect(expenses[0]!.quantity).toBe(1);
      expect(expenses[0]!.category).toBe(EXPENSE_CATEGORIES.FOOD);
      expect(expenses[0]!.date).toBeInstanceOf(Date);
    });
  });

  describe('create expense', () => {
    test('should create expense successfully', async () => {
      const expenseData = {
        description: 'Test Expense',
        price: 5,
        quantity: 2,
        category: EXPENSE_CATEGORIES.FOOD,
        date: new Date('2024-02-01T00:00:00.000Z'),
      };

      const created = await createExpense(expenseData);
      expect(created).toBeDefined();
      expect(created.id).toBeDefined();
      expect(created.description).toBe('Test Expense');
      expect(created.price).toBe(5);
      expect(created.quantity).toBe(2);
      expect(created.category).toBe(EXPENSE_CATEGORIES.FOOD);
      expect(created.date).toBeInstanceOf(Date);
    });
  });

  describe('update expense', () => {
    test('should update expense successfully', async () => {
      const created = db.expense.create({
        description: 'Test Expense',
        price: 5,
        quantity: 2,
        category: EXPENSE_CATEGORIES.FOOD,
        date: new Date('2024-02-01T00:00:00.000Z').toISOString(),
      });

      const updated = await updateExpense(created.id, {
        description: 'Cinema',
        price: 4,
        quantity: 2,
        category: EXPENSE_CATEGORIES.ENTERTAINMENT,
        date: new Date('2024-02-04T00:00:00.000Z'),
      });

      expect(updated).toBeDefined();
      expect(updated.description).toBe('Cinema');
      expect(updated.price).toBe(4);
      expect(updated.quantity).toBe(2);
      expect(updated.totalPrice).toBe(8);
      expect(updated.date.toISOString()).toBe('2024-02-04T00:00:00.000Z');
      expect(updated.category).toBe(EXPENSE_CATEGORIES.ENTERTAINMENT);
    });

    test('should handle update expense error (404 not found)', async ({ worker }) => {
      worker.use(
        http.patch('/api/expenses/nonexistent-expense', () => {
          return HttpResponse.json({ error: 'Expense not found' }, { status: 404 });
        }),
      );

      await expect(
        updateExpense('nonexistent-expense', {
          description: 'Cinema',
          price: 4,
          quantity: 2,
          category: EXPENSE_CATEGORIES.ENTERTAINMENT,
          date: new Date('2024-02-04T00:00:00.000Z'),
        }),
      ).rejects.toThrow();
    });
  });

  describe('delete expense', () => {
    test('should delete expense successfully', async () => {
      const expenseData = {
        description: 'Expense to Delete',
        price: 5,
        quantity: 1,
        category: EXPENSE_CATEGORIES.FOOD,
        date: new Date('2024-02-01T00:00:00.000Z').toISOString(),
      };

      const created = db.expense.create(expenseData);
      const deleted = await deleteExpense(created.id);
      expect(deleted).toBeUndefined();
    });

    test('should handle delete expense error (404 not found)', async ({ worker }) => {
      worker.use(
        http.delete('/api/expenses/nonexistent-expense', () => {
          return HttpResponse.json({ error: 'Expense not found' }, { status: 404 });
        }),
      );

      await expect(deleteExpense('nonexistent-expense')).rejects.toThrow();
    });
  });

  test('should handle API errors', async ({ worker }) => {
    worker.use(
      http.get('/api/expenses', () => {
        return new HttpResponse('Internal Server Error', { status: 500 });
      }),
    );

    await expect(getExpenses()).rejects.toThrow();
  });
});
