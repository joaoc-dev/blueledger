import mongoose from 'mongoose';
import { afterEach, describe, expect } from 'vitest';
import { db } from '@/tests/mocks/db';
import { setMockAuthenticatedUser } from '@/tests/mocks/handlers/expense-handlers';
import { test } from '@/tests/test-extend';
import { HTTP_VERB, simulateError } from '@/tests/utils';
import { createExpense, deleteExpense, getExpenses, updateExpense } from '../client';
import { EXPENSE_CATEGORIES } from '../constants';

describe('expenses client (browser)', () => {
  // Clean up after each test to ensure isolation
  afterEach(() => {
    db.expense.deleteMany({ where: {} });
    // Reset mock authenticated user
    setMockAuthenticatedUser(null);
  });

  describe('get expenses', () => {
    test('should get expenses list', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      setMockAuthenticatedUser(userId);

      db.expense.create({
        description: 'Test Coffee',
        price: 3,
        quantity: 1,
        totalPrice: 3,
        category: EXPENSE_CATEGORIES.FOOD,
        date: new Date('2024-02-01T00:00:00.000Z').toISOString(),
        user: userId,
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

    test('should only get expenses for authenticated user', async () => {
      const user1Id = new mongoose.Types.ObjectId().toString();
      const user2Id = new mongoose.Types.ObjectId().toString();

      // Set user1 as the authenticated user
      setMockAuthenticatedUser(user1Id);

      // Create expenses for user 1
      db.expense.create({
        description: 'User 1 Coffee',
        price: 3,
        quantity: 1,
        totalPrice: 3,
        category: EXPENSE_CATEGORIES.FOOD,
        date: new Date('2024-02-01T00:00:00.000Z').toISOString(),
        user: user1Id,
      });

      db.expense.create({
        description: 'User 1 Lunch',
        price: 15,
        quantity: 1,
        totalPrice: 15,
        category: EXPENSE_CATEGORIES.FOOD,
        date: new Date('2024-02-01T00:00:00.000Z').toISOString(),
        user: user1Id,
      });

      // Create expenses for user 2
      db.expense.create({
        description: 'User 2 Movie',
        price: 12,
        quantity: 1,
        totalPrice: 12,
        category: EXPENSE_CATEGORIES.ENTERTAINMENT,
        date: new Date('2024-02-01T00:00:00.000Z').toISOString(),
        user: user2Id,
      });

      const expenses = await getExpenses();

      // Should only get user 1's expenses
      expect(expenses).toHaveLength(2);
      expect(expenses.every(expense =>
        expense.description === 'User 1 Coffee'
        || expense.description === 'User 1 Lunch',
      )).toBe(true);

      // Should not include user 2's expenses
      expect(expenses.some(expense => expense.description === 'User 2 Movie')).toBe(false);
    });

    test('should return 401 when user is not authenticated', async () => {
      // Don't set any authenticated user
      setMockAuthenticatedUser(null);

      // Create some expenses in the database
      db.expense.create({
        description: 'Some Expense',
        price: 10,
        quantity: 1,
        totalPrice: 10,
        category: EXPENSE_CATEGORIES.FOOD,
        date: new Date('2024-02-01T00:00:00.000Z').toISOString(),
        user: new mongoose.Types.ObjectId().toString(),
      });

      // Should throw error when not authenticated (401 Unauthorized)
      await expect(getExpenses()).rejects.toThrow();
    });
  });

  describe('create expense', () => {
    test('should create expense successfully', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      setMockAuthenticatedUser(userId);

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

    test('should fail to create expense when not authenticated', async () => {
      setMockAuthenticatedUser(null);

      const expenseData = {
        description: 'Test Expense',
        price: 5,
        quantity: 2,
        category: EXPENSE_CATEGORIES.FOOD,
        date: new Date('2024-02-01T00:00:00.000Z'),
      };

      await expect(createExpense(expenseData)).rejects.toThrow();
    });
  });

  describe('update expense', () => {
    test('should update expense successfully', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      setMockAuthenticatedUser(userId);

      const created = db.expense.create({
        description: 'Test Expense',
        price: 5,
        quantity: 2,
        category: EXPENSE_CATEGORIES.FOOD,
        date: new Date('2024-02-01T00:00:00.000Z').toISOString(),
        user: userId,
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

    test('should not update expense belonging to another user', async () => {
      const user1Id = new mongoose.Types.ObjectId().toString();
      const user2Id = new mongoose.Types.ObjectId().toString();

      setMockAuthenticatedUser(user1Id);

      // Create expense for user 2
      const otherUserExpense = db.expense.create({
        description: 'Other User Expense',
        price: 5,
        quantity: 2,
        category: EXPENSE_CATEGORIES.FOOD,
        date: new Date('2024-02-01T00:00:00.000Z').toISOString(),
        user: user2Id,
      });

      await expect(
        updateExpense(otherUserExpense.id, {
          description: 'Cinema',
          price: 4,
          quantity: 2,
          category: EXPENSE_CATEGORIES.ENTERTAINMENT,
          date: new Date('2024-02-04T00:00:00.000Z'),
        }),
      ).rejects.toThrow();
    });

    test('should handle update expense error (404 not found)', async ({ worker }) => {
      const userId = new mongoose.Types.ObjectId().toString();
      setMockAuthenticatedUser(userId);

      simulateError(worker, HTTP_VERB.PATCH, '/api/expenses/nonexistent-expense', 404);

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
      const userId = new mongoose.Types.ObjectId().toString();
      setMockAuthenticatedUser(userId);

      const expenseData = {
        description: 'Expense to Delete',
        price: 5,
        quantity: 1,
        category: EXPENSE_CATEGORIES.FOOD,
        date: new Date('2024-02-01T00:00:00.000Z').toISOString(),
        user: userId,
      };

      const created = db.expense.create(expenseData);
      const deleted = await deleteExpense(created.id);

      // The API returns the deleted expense object
      expect(deleted).toBeDefined();
      expect(deleted.description).toBe('Expense to Delete');
      expect(deleted.price).toBe(5);
      expect(deleted.quantity).toBe(1);
      expect(deleted.category).toBe(EXPENSE_CATEGORIES.FOOD);
    });

    test('should not delete expense belonging to another user', async () => {
      const user1Id = new mongoose.Types.ObjectId().toString();
      const user2Id = new mongoose.Types.ObjectId().toString();

      setMockAuthenticatedUser(user1Id);

      // Create expense for user 2
      const otherUserExpense = db.expense.create({
        description: 'Other User Expense',
        price: 5,
        quantity: 1,
        category: EXPENSE_CATEGORIES.FOOD,
        date: new Date('2024-02-01T00:00:00.000Z').toISOString(),
        user: user2Id,
      });

      await expect(deleteExpense(otherUserExpense.id)).rejects.toThrow();
    });

    test('should handle delete expense error (404 not found)', async ({ worker }) => {
      const userId = new mongoose.Types.ObjectId().toString();
      setMockAuthenticatedUser(userId);

      simulateError(worker, HTTP_VERB.DELETE, '/api/expenses/nonexistent-expense', 404);

      await expect(deleteExpense('nonexistent-expense')).rejects.toThrow();
    });
  });

  test('should handle API errors', async ({ worker }) => {
    const userId = new mongoose.Types.ObjectId().toString();
    setMockAuthenticatedUser(userId);

    simulateError(worker, HTTP_VERB.GET, '/api/expenses', 500);

    await expect(getExpenses()).rejects.toThrow();
  });
});
