'use client';

import { PusherEvents } from '@/constants/pusher-events';
import { getPusherClient } from '@/lib/pusher/pusher-client';
import { getQueryClient } from '@/lib/react-query/get-query-client';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useNotifications } from '../../hooks';
import { useNotificationsStore } from './store';

export default function NotificationsStoreInitializer() {
  const { data: session } = useSession();
  const { notifications } = useNotifications();
  const setNotifications = useNotificationsStore(
    (state) => state.setNotifications
  );

  useEffect(() => {
    if (!notifications) return;
    setNotifications(notifications);
  }, [notifications, setNotifications]);

  useEffect(() => {
    if (!session?.user?.id) return;

    const queryClient = getQueryClient();

    const pusherClient = getPusherClient();
    const privateChannel = `private-user-${session?.user?.id}`;
    const channel = pusherClient.subscribe(privateChannel);

    channel.bind(PusherEvents.NOTIFICATION, () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [session]);

  return null;
}
