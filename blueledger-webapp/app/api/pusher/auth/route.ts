import type { NextAuthRequest } from 'next-auth';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import { withAuth } from '@/lib/api/withAuth';
import { createLogger, logRequest } from '@/lib/logger';
import { authorizeChannel } from '@/lib/pusher/pusher-server';

export const POST = withAuth(async (request: NextAuthRequest) => {
  const logger = createLogger('api/pusher/auth');
  const startTime = Date.now();
  let requestId: string | undefined;

  try {
    ({ requestId } = logRequest(logger, request));

    const formData = await request.text();
    const params = new URLSearchParams(formData);

    const socket_id = params.get('socket_id');
    const channel_name = params.get('channel_name');

    const userId = request.auth!.user!.id;
    const expectedChannel = `private-user-${userId}`;

    if (channel_name !== expectedChannel) {
      logger.warn(LogEvents.PUSHER_CHANNEL_MISMATCH, {
        requestId,
        expectedChannel,
        channel_name,
        status: 401,
        durationMs: Date.now() - startTime,
      });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const authResponse = authorizeChannel(socket_id!, channel_name!);
    logger.info(LogEvents.PUSHER_CHANNEL_AUTHORIZED, {
      requestId,
      userId,
      channel_name,
      socket_id,
      status: 200,
      durationMs: Date.now() - startTime,
    });
    return NextResponse.json(authResponse);
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.PUSHER_ERROR_AUTHORIZING_CHANNEL, {
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
