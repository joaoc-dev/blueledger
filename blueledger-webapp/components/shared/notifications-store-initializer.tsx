'use client';

import { useEffect } from 'react';
import { useNotificationsStore } from '@/app/(protected)/store';
import { useNotifications } from '@/features/notifications.ts/hooks';
import { getQueryClient } from '@/lib/react-query/get-query-client';
import { getPusherClient } from '@/lib/pusher/pusher-client';
import { PusherEvents } from '@/constants/pusher-events';
import { useSession } from 'next-auth/react';

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
    const channel = pusherClient.subscribe(session?.user?.id!);

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
