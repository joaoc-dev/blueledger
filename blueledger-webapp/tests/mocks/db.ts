import { faker } from '@faker-js/faker';
import { factory, primaryKey } from '@mswjs/data';
import mongoose from 'mongoose';
import { EXPENSE_CATEGORIES } from '@/features/expenses/constants';
import { NOTIFICATION_TYPES } from '@/features/notifications/constants';

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
    price: () => faker.number.int({ min: 0, max: 1000 }),
    quantity: () => faker.number.int({ min: 1, max: 100 }),
    totalPrice: () => faker.number.int({ min: 0, max: 1000 }),
    category: () => faker.helpers.arrayElement(Object.values(EXPENSE_CATEGORIES)),
    date: () => new Date().toISOString(),
    createdAt: () => new Date().toISOString(),
    updatedAt: () => new Date().toISOString(),
    user: () => new mongoose.Types.ObjectId().toString(),
  },
  notification: {
    id: primaryKey(() => new mongoose.Types.ObjectId().toString()),
    user: () => new mongoose.Types.ObjectId().toString(),
    fromUser: () => new mongoose.Types.ObjectId().toString(),
    type: () => faker.helpers.arrayElement(Object.values(NOTIFICATION_TYPES)),
    isRead: () => faker.datatype.boolean(),
    createdAt: () => new Date().toISOString(),
    updatedAt: () => new Date().toISOString(),
  },
});
