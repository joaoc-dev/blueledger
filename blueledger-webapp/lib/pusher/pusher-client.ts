'use client';

import type { Channel } from 'pusher-js';
import Pusher from 'pusher-js';
import { env } from '@/env/client';

interface PusherClient {
  subscribe: (channelName: string) => Channel;
}

let pusherClient: PusherClient | undefined;

function makePusherClient() {
  Pusher.logToConsole = true;

  const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
    cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
    authEndpoint: '/api/pusher/auth',
  });

  return {
    subscribe: (channelName: string) => pusher.subscribe(channelName),
  };
}

function getPusherClient() {
  if (!pusherClient) {
    pusherClient = makePusherClient();
  }
  return pusherClient;
}

export { getPusherClient };
