'use client';

import { useEffect } from 'react';
import { useNotificationsStore } from '@/app/(protected)/store';
import { useNotifications } from '@/features/notifications.ts/hooks';
import { getQueryClient } from '@/lib/react-query/get-query-client';
import { getPusherClient } from '@/lib/pusher/pusher-client';
import { PusherEvents } from '@/constants/pusher-events';

export default function UserProfileStoreInitializer() {
  const { notifications } = useNotifications();
  const setNotifications = useNotificationsStore(
    (state) => state.setNotifications
  );

  useEffect(() => {
    if (!notifications) return;
    setNotifications(notifications);
  }, [notifications, setNotifications]);

  useEffect(() => {
    const queryClient = getQueryClient();

    const pusherClient = getPusherClient();
    const channel = pusherClient.subscribe('user-123');

    channel.bind(PusherEvents.NOTIFICATION, () => {
      console.log('Notification received!');
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  return null;
}
