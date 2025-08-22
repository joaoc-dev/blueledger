import mongoose from 'mongoose';
import { http, HttpResponse } from 'msw';
import { db } from '../db';

// Note: We intentionally avoid using auto-generated MSW handlers (expenseModel.toHandlers)
// Instead, we define explicit handlers that give us full control over request/response handling.
const getExpensesHandler = http.get('/api/expenses', () => {
  return HttpResponse.json(db.expense.getAll());
});

const createExpenseHandler = http.post('/api/expenses', async ({ request }) => {
  const body = (await request.json()) as any;
  const created = db.expense.create({
    description: body.description,
    price: body.price,
    quantity: body.quantity,
    totalPrice: body.price * body.quantity,
    category: body.category,
    date: body.date,
    user: new mongoose.Types.ObjectId().toString(),
  });
  return HttpResponse.json(created, { status: 201 });
});

const updateExpenseHandler = http.patch('/api/expenses/:id', async ({ params, request }) => {
  const id = String(params.id);
  const body = (await request.json()) as any;

  const updated = db.expense.update({
    where: { id: { equals: id } },
    data: {
      ...body,
      totalPrice: body.price * body.quantity,
      updatedAt: new Date().toISOString(),
    },
  });

  if (!updated)
    return HttpResponse.json({ error: 'Not found' }, { status: 404 });

  return HttpResponse.json(updated);
});

const deleteExpenseHandler = http.delete('/api/expenses/:id', ({ params }) => {
  const id = String(params.id);
  const expense = db.expense.findFirst({ where: { id: { equals: id } } });

  if (!expense) {
    return HttpResponse.json({ error: 'Not found' }, { status: 404 });
  }

  db.expense.delete({ where: { id: { equals: id } } });

  return new HttpResponse(null, { status: 204 });
});

const customExpenseHandlers = [
  getExpensesHandler,
  createExpenseHandler,
  updateExpenseHandler,
  deleteExpenseHandler,
];

export const expenseHandlers = customExpenseHandlers;
