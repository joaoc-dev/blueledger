import type { UIMessage } from 'ai';
import type { NextAuthRequest } from 'next-auth';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import { CHATBOT_POST_LIMIT_DAILY, CHATBOT_POST_LIMIT_SHORT } from '@/features/chatbot/constants';
import { getConversationHistory } from '@/features/chatbot/data';
import { updateHistoryAndGenerateResponse } from '@/features/chatbot/service';
import { withAuth } from '@/lib/api/withAuth';
import { createLogger } from '@/lib/logger';
import { validateRateLimit } from '@/lib/rate-limit';

/**
 * POST /api/chatbot
 *
 * Processes a chatbot message and generates a response.
 * Delegates recall (vector-based similar messages) and a sliding window over recent messages
 * to the service, which updates conversation history and streams the AI-generated response.
 *
 * Return statuses:
 * - 200 OK : Message processed and response generated successfully.
 * - 401 Unauthorized : User is not authenticated.
 * - 500 Internal Server Error : Unexpected error during processing.
 */
export const POST = withAuth(async (request: NextAuthRequest) => {
  const logger = createLogger('api/chatbot:post', request);

  try {
    const body = await request.json();
    const { messages }: { messages: UIMessage[] } = body;
    const userId = request.auth!.user!.id;

    const rate = await validateRateLimit(
      `chatbot:${userId}`,
      CHATBOT_POST_LIMIT_SHORT,
      CHATBOT_POST_LIMIT_DAILY,
    );
    if (!rate.success) {
      logger.info(LogEvents.RATE_LIMIT_EXCEEDED, {
        userId,
        status: 429,
      });

      await logger.flush();
      return NextResponse.json(
        {
          error: 'Please wait before sending another message.',
          retryAfter: rate.retryAfterSeconds,
        },
        { status: 429 },
      );
    }

    logger.info(LogEvents.CHATBOT_MESSAGE_PROCESSING, {
      messages: messages.length,
      status: 200,
    });
    await logger.flush();

    return await updateHistoryAndGenerateResponse(
      messages,
      body.model,
      userId,
      body.trigger,
      logger,
    );
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_PROCESSING_CHATBOT_MESSAGE, {
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    });

    await logger.flush();
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
});

/**
 * GET /api/chatbot
 *
 * Retrieves conversation history for the authenticated user.
 * Supports pagination with optional limit and cursor query parameters.
 * Returns paginated conversation messages in chronological order.
 *
 * Query parameters:
 * - limit (optional): Number of messages to return (default: 20, max: 100)
 * - cursor (optional): Cursor for pagination
 *
 * Return statuses:
 * - 200 OK : Conversation history retrieved successfully.
 * - 401 Unauthorized : User is not authenticated.
 * - 500 Internal Server Error : Unexpected error during processing.
 */
export const GET = withAuth(async (request: NextAuthRequest) => {
  const logger = createLogger('api/chatbot:get', request);

  try {
    const userId = request.auth!.user!.id;
    const { searchParams } = new URL(request.url);

    const limit = parseLimitParam(searchParams.get('limit'));
    const cursor = searchParams.get('cursor') ?? undefined;

    const result = await getConversationHistory(userId, limit, cursor);

    logger.info(LogEvents.CHATBOT_MESSAGES_FETCHED, {
      returnedCount: result.messages.length,
      status: 200,
    });

    await logger.flush();
    return NextResponse.json(result);
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_GETTING_CHATBOT_MESSAGES, {
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    });

    await logger.flush();
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
});

/**
 * Parse and validate the `limit` query parameter.
 *
 * - Converts the string value to a number
 * - Falls back to `defaultValue` if invalid or non-positive
 * - Clamps the result to the given `max`
 *
 * @param param - The raw query parameter value (string or null)
 * @param defaultValue - Fallback value when parsing fails (default: 20)
 * @param max - Maximum allowed value (default: 100)
 * @returns A safe numeric limit within range
 */
function parseLimitParam(param: string | null, defaultValue = 20, max = 100): number {
  const num = Number(param);
  if (Number.isNaN(num) || num <= 0)
    return defaultValue;

  return Math.min(num, max);
}
