import { PusherEvent } from '@/constants/pusher-events';
import Pusher from 'pusher';

const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

const sendToPusher = async (
  channel: string,
  event: PusherEvent,
  message: string
) => {
  await pusherServer.trigger(channel, event, {
    message,
  });
};

const authorizeChannel = (socket_id: string, channel_name: string) => {
  return pusherServer.authorizeChannel(socket_id, channel_name);
};

export { sendToPusher, authorizeChannel };
