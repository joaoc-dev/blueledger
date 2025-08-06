'use client';

import Pusher, { Channel } from 'pusher-js';

interface PusherClient {
  subscribe: (channelName: string) => Channel;
}

let pusherClient: PusherClient | undefined = undefined;

function makePusherClient() {
  Pusher.logToConsole = true;

  const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
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
