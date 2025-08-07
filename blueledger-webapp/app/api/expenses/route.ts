import type { NextAuthRequest } from 'next-auth';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import { createExpense, getExpenses } from '@/features/expenses/data';
import { createExpenseSchema } from '@/features/expenses/schemas';
import { withAuth } from '@/lib/api/withAuth';
import { createLogger, logRequest } from '@/lib/logger';
import { validateRequest } from '../validateRequest';

export const POST = withAuth(async (request: NextAuthRequest) => {
  const logger = createLogger('api/expenses/create');
  const startTime = Date.now();
  let requestId: string | undefined;

  try {
    const body = await request.json();
    ({ requestId } = logRequest(logger, request));

    const userId = request.auth!.user!.id;

    const validationResult = validateRequest(createExpenseSchema, {
      data: {
        ...body,
        user: userId,
      },
    });

    if (!validationResult.success) {
      logger.warn(LogEvents.VALIDATION_FAILED, {
        requestId,
        details: validationResult.error.details,
        status: 400,
        durationMs: Date.now() - startTime,
      });

      return NextResponse.json(validationResult.error, { status: 400 });
    }

    const expense = await createExpense(validationResult.data!);
    logger.info(LogEvents.EXPENSE_CREATED, {
      requestId,
      expenseId: expense.id,
      status: 201,
      durationMs: Date.now() - startTime,
    });

    return NextResponse.json(expense, { status: 201 });
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_CREATING_EXPENSE, {
      requestId,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      durationMs: Date.now() - startTime,
    });

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
});

export const GET = withAuth(async (request: NextAuthRequest) => {
  const logger = createLogger('api/expenses/get');
  const startTime = Date.now();
  let requestId: string | undefined;

  try {
    ({ requestId } = logRequest(logger, request));

    const userId = request.auth!.user!.id;

    const expenses = await getExpenses(userId);

    logger.info(LogEvents.EXPENSES_FETCHED, {
      requestId,
      returnedCount: expenses.length,
      status: 200,
      durationMs: Date.now() - startTime,
    });

    return NextResponse.json(expenses);
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_GETTING_EXPENSES, {
      requestId,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      durationMs: Date.now() - startTime,
    });

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
});
