import type { PusherEvent } from '@/constants/pusher-events';
import * as Sentry from '@sentry/nextjs';
import Pusher from 'pusher';
import { LogEvents } from '@/constants/log-events';
import { env as clientEnv } from '@/env/client';
import { env } from '@/env/server';
import { createLogger } from '@/lib/logger';

const pusherServer = new Pusher({
  appId: env.PUSHER_APP_ID,
  key: clientEnv.NEXT_PUBLIC_PUSHER_KEY,
  secret: env.PUSHER_SECRET,
  cluster: clientEnv.NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true,
});

async function sendToPusher(channel: string, event: PusherEvent, message: string) {
  const logger = createLogger('lib/pusher');

  try {
    await pusherServer.trigger(channel, event, {
      message,
    });
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_SENDING_EXPENSE_NOTIFICATION, {
      channel,
      event,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    throw error;
  }
}

function authorizeChannel(socket_id: string, channel_name: string) {
  return pusherServer.authorizeChannel(socket_id, channel_name);
}

export { authorizeChannel, sendToPusher };
