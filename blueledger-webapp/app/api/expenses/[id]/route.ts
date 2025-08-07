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
import { createLogger, logRequest } from '@/lib/logger';
import { validateRequest } from '../../validateRequest';

export const PATCH = withAuth(async (
  request: NextAuthRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const logger = createLogger('api/expenses/patch');
  const startTime = Date.now();
  let requestId: string | undefined;

  try {
    const { id } = await params;
    const body = await request.json();
    ({ requestId } = logRequest(logger, request));

    const validationResult = validateRequest(patchExpenseSchema, {
      id,
      data: body,
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

    const userId = request.auth!.user!.id;
    const expense = await updateExpense(validationResult.data!, userId);
    if (!expense) {
      logger.warn(LogEvents.EXPENSE_NOT_FOUND, {
        requestId,
        id,
        status: 404,
        durationMs: Date.now() - startTime,
      });
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    logger.info(LogEvents.EXPENSE_UPDATED, {
      requestId,
      expenseId: expense.id,
      status: 200,
      durationMs: Date.now() - startTime,
    });
    return NextResponse.json(expense, { status: 200 });
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_PATCHING_EXPENSE, {
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

export const DELETE = withAuth(async (
  request: NextAuthRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const logger = createLogger('api/expenses/delete');
  const startTime = Date.now();
  let requestId: string | undefined;
  try {
    const { id } = await params;
    ({ requestId } = logRequest(logger, request));

    const validationResult = validateRequest(deleteExpenseSchema, {
      id,
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

    const userId = request.auth!.user!.id;
    const expense = await deleteExpense(id, userId);

    if (!expense) {
      logger.warn(LogEvents.EXPENSE_NOT_FOUND, {
        requestId,
        id,
        status: 404,
        durationMs: Date.now() - startTime,
      });
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    logger.info(LogEvents.EXPENSE_DELETED, {
      requestId,
      expenseId: expense.id,
      status: 200,
      durationMs: Date.now() - startTime,
    });
    return NextResponse.json(expense, { status: 200 });
  }
  catch (error) {
    Sentry.captureException(error);
    logger.error(LogEvents.ERROR_DELETING_EXPENSE, {
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
