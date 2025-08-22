import { faker } from '@faker-js/faker';
import { factory, primaryKey } from '@mswjs/data';
import mongoose from 'mongoose';
import { EXPENSE_CATEGORIES } from '@/features/expenses/constants';

/**
 * MSW Data factory for generating mock data and REST API handlers
 *
 * Auto-generated REST handlers when calling db.expense.toHandlers('rest', '/api/expenses'):
 * - GET /expenses/:id - Returns an expense by ID (where "id" is the model's primary key)
 * - GET /expenses - Returns all expenses (supports pagination)
 * - POST /expenses - Creates a new expense
 * - PUT /expenses/:id - Updates an existing expense by ID
 * - DELETE /expenses/:id - Deletes an existing expense by ID
 */

export const db = factory({
  expense: {
    id: primaryKey(() => new mongoose.Types.ObjectId().toString()),
    description: () => faker.commerce.productName(),
    price: () => 1,
    quantity: () => 1,
    totalPrice: () => 1,
    category: () => EXPENSE_CATEGORIES.FOOD,
    date: () => new Date().toISOString(),
    createdAt: () => new Date().toISOString(),
    updatedAt: () => new Date().toISOString(),
    user: () => new mongoose.Types.ObjectId().toString(),
  },
});
