import { http, HttpResponse } from 'msw';
import { db } from '../db';

// Mock authenticated user ID for testing
// In a real scenario, this would come from the auth context
let mockAuthenticatedUserId: string | null = null;

export function setMockAuthenticatedUser(userId: string | null) {
  mockAuthenticatedUserId = userId;
}

// Note: We intentionally avoid using auto-generated MSW handlers (expenseModel.toHandlers)
// Instead, we define explicit handlers that give us full control over request/response handling.
const getExpensesHandler = http.get('/api/expenses', () => {
  if (!mockAuthenticatedUserId) {
    // If no authenticated user, return 401 Unauthorized (matching withAuth behavior)
    return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Filter expenses to only return those belonging to the authenticated user
  const userExpenses = db.expense.findMany({
    where: { user: { equals: mockAuthenticatedUserId } },
  });

  return HttpResponse.json(userExpenses);
});

const createExpenseHandler = http.post('/api/expenses', async ({ request }) => {
  if (!mockAuthenticatedUserId) {
    return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json()) as any;
  const created = db.expense.create({
    description: body.description,
    price: body.price,
    quantity: body.quantity,
    totalPrice: body.price * body.quantity,
    category: body.category,
    date: body.date,
    user: mockAuthenticatedUserId, // Use the authenticated user ID
  });
  return HttpResponse.json(created, { status: 201 });
});

const updateExpenseHandler = http.patch('/api/expenses/:id', async ({ params, request }) => {
  if (!mockAuthenticatedUserId) {
    return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = String(params.id);
  const body = (await request.json()) as any;

  // First check if the expense belongs to the authenticated user
  const existingExpense = db.expense.findFirst({
    where: {
      id: { equals: id },
      user: { equals: mockAuthenticatedUserId },
    },
  });

  if (!existingExpense) {
    // Return 404 with "Expense not found" message (matching the actual API)
    return HttpResponse.json({ error: 'Expense not found' }, { status: 404 });
  }

  const updated = db.expense.update({
    where: { id: { equals: id } },
    data: {
      ...body,
      totalPrice: body.price * body.quantity,
      updatedAt: new Date().toISOString(),
    },
  });

  if (!updated)
    return HttpResponse.json({ error: 'Expense not found' }, { status: 404 });

  return HttpResponse.json(updated);
});

const deleteExpenseHandler = http.delete('/api/expenses/:id', ({ params }) => {
  if (!mockAuthenticatedUserId) {
    return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = String(params.id);

  // First check if the expense belongs to the authenticated user
  const expense = db.expense.findFirst({
    where: {
      id: { equals: id },
      user: { equals: mockAuthenticatedUserId },
    },
  });

  if (!expense) {
    // Return 404 with "Expense not found" message (matching the actual API)
    return HttpResponse.json({ error: 'Expense not found' }, { status: 404 });
  }

  db.expense.delete({ where: { id: { equals: id } } });

  // Return the deleted expense (matching the actual API behavior)
  return HttpResponse.json(expense);
});

const customExpenseHandlers = [
  getExpensesHandler,
  createExpenseHandler,
  updateExpenseHandler,
  deleteExpenseHandler,
];

export const expenseHandlers = customExpenseHandlers;
