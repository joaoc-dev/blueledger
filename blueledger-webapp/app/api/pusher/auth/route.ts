import type { NextAuthRequest } from 'next-auth';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import { withAuth } from '@/lib/api/withAuth';
import { createLogger } from '@/lib/logger';
import { authorizeChannel } from '@/lib/pusher/pusher-server';

export const POST = withAuth(async (request: NextAuthRequest) => {
  const logger = createLogger('api/pusher/auth', request);

  try {
    const formData = await request.text();
    const params = new URLSearchParams(formData);

    const socket_id = params.get('socket_id');
    const channel_name = params.get('channel_name');

    const userId = request.auth!.user!.id;
    const expectedChannel = `private-user-${userId}`;

    if (channel_name !== expectedChannel) {
      logger.warn(LogEvents.PUSHER_CHANNEL_MISMATCH, {
        expectedChannel,
        channel_name,
        status: 401,
      });
      await logger.flush();
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const authResponse = authorizeChannel(socket_id!, channel_name!);
    logger.info(LogEvents.PUSHER_CHANNEL_AUTHORIZED, {
      userId,
      channel_name,
      socket_id,
      status: 200,
    });
    await logger.flush();
    return NextResponse.json(authResponse);
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.PUSHER_ERROR_AUTHORIZING_CHANNEL, {
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    });

    await logger.flush();
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});
