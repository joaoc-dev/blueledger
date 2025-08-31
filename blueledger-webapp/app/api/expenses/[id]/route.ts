import type { NextAuthRequest } from 'next-auth';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import { deleteExpense, updateExpense } from '@/features/expenses/data';
import {
  deleteExpenseSchema,
  patchExpenseSchema,
} from '@/features/expenses/schemas';
import { withAuth } from '@/lib/api/withAuth';
import { createLogger } from '@/lib/logger';
import { validateSchema } from '@/lib/validate-schema';

export const PATCH = withAuth(async (
  request: NextAuthRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const logger = createLogger('api/expenses/[id]:patch', request);

  try {
    const { id } = await params;
    const body = await request.json();

    const validationResult = validateSchema(patchExpenseSchema, { id, data: body });
    if (!validationResult.success) {
      logger.warn(LogEvents.VALIDATION_FAILED, {
        details: validationResult.error.details,
        status: 400,
      });

      await logger.flush();
      return NextResponse.json(validationResult.error, { status: 400 });
    }

    const userId = request.auth!.user!.id;
    const expense = await updateExpense(validationResult.data!, userId);
    if (!expense) {
      logger.warn(LogEvents.EXPENSE_NOT_FOUND, {
        id,
        status: 404,
      });

      await logger.flush();
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    logger.info(LogEvents.EXPENSE_UPDATED, { expenseId: expense.id, status: 200 });
    await logger.flush();
    return NextResponse.json(expense, { status: 200 });
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_PATCHING_EXPENSE, {
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    });

    await logger.flush();
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});

export const DELETE = withAuth(async (
  request: NextAuthRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const logger = createLogger('api/expenses/[id]:delete', request);
  try {
    const { id } = await params;

    const validationResult = validateSchema(deleteExpenseSchema, { id });
    if (!validationResult.success) {
      logger.warn(LogEvents.VALIDATION_FAILED, {
        details: validationResult.error.details,
        status: 400,
      });
      await logger.flush();
      return NextResponse.json(validationResult.error, { status: 400 });
    }

    const userId = request.auth!.user!.id;
    const expense = await deleteExpense(id, userId);

    if (!expense) {
      logger.warn(LogEvents.EXPENSE_NOT_FOUND, { id, status: 404 });

      await logger.flush();
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    logger.info(LogEvents.EXPENSE_DELETED, { expenseId: expense.id, status: 200 });
    await logger.flush();
    return NextResponse.json(expense, { status: 200 });
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_DELETING_EXPENSE, {
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    });

    await logger.flush();
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});
