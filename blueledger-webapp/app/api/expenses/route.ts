import type { NextAuthRequest } from 'next-auth';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import { createExpense, getExpenses } from '@/features/expenses/data';
import { createExpenseSchema } from '@/features/expenses/schemas';
import { withAuth } from '@/lib/api/withAuth';
import { createLogger } from '@/lib/logger';
import { validateSchema } from '@/lib/validate-schema';

export const POST = withAuth(async (request: NextAuthRequest) => {
  const logger = createLogger('api/expenses:post', request);

  try {
    const body = await request.json();
    const userId = request.auth!.user!.id;

    const data = { ...body, user: userId };
    const validationResult = validateSchema(createExpenseSchema, { data });

    if (!validationResult.success) {
      logger.warn(LogEvents.VALIDATION_FAILED, {
        details: validationResult.error.details,
        status: 400,
      });

      await logger.flush();
      return NextResponse.json(validationResult.error, { status: 400 });
    }

    const expense = await createExpense(validationResult.data!);
    logger.info(LogEvents.EXPENSE_CREATED, {
      expenseId: expense.id,
      status: 201,
    });

    await logger.flush();
    return NextResponse.json(expense, { status: 201 });
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_CREATING_EXPENSE, {
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    });

    await logger.flush();
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});

export const GET = withAuth(async (request: NextAuthRequest) => {
  const logger = createLogger('api/expenses:get', request);

  try {
    const userId = request.auth!.user!.id;

    const expenses = await getExpenses(userId);
    logger.info(LogEvents.EXPENSES_FETCHED, {
      returnedCount: expenses.length,
      status: 200,
    });

    await logger.flush();
    return NextResponse.json(expenses);
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_GETTING_EXPENSES, {
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    });

    await logger.flush();
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});
