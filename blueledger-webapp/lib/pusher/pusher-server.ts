import type { PusherEvent } from '@/constants/pusher-events';
import Pusher from 'pusher';
import { env as clientEnv } from '@/env/client';
import { env } from '@/env/server';

const pusherServer = new Pusher({
  appId: env.PUSHER_APP_ID,
  key: clientEnv.NEXT_PUBLIC_PUSHER_KEY,
  secret: env.PUSHER_SECRET,
  cluster: clientEnv.NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true,
});

async function sendToPusher(channel: string, event: PusherEvent, message: string) {
  await pusherServer.trigger(channel, event, {
    message,
  });
}

function authorizeChannel(socket_id: string, channel_name: string) {
  return pusherServer.authorizeChannel(socket_id, channel_name);
}

export { authorizeChannel, sendToPusher };
