import { useEffect, useState, useCallback } from 'react';
// import {
//   getNotifications,
//   NotificationWithUser,
// } from '@/lib/data/notifications.mock';
import { NotificationTypes } from '@/constants/notification-type';
import { getNotifications } from '@/services/notifications/notifications';

import Pusher from 'pusher-js';
import { NotificationType } from '@/types/notification';

export function useNotifications() {
  const [items, setItems] = useState<NotificationType[]>([]);

  // const addDummyNotification = () => {
  //   const dummyNotificationWithUser = {
  //     id: items.length + 1,
  //     userId: '1',
  //     type: NotificationTypes.FRIEND_REQUEST,
  //     timestamp: new Date().toISOString(),
  //     isRead: false,
  //     userName: 'John Doe',
  //     userImage: 'https://github.com/shadcn.png',
  //   };

  //   setItems((prev) => [...prev, dummyNotificationWithUser]);
  // };

  const fetchNotifications = async () => {
    const notifications = await getNotifications();
    setItems(notifications);
  };

  useEffect(() => {
    fetchNotifications();

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe('user-123');
    channel.bind('new-notification', () => {
      console.log('Notification received!');
      // addDummyNotification();
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  const markAsRead = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const read = items.filter((n) => n.isRead);
  const unread = items.filter((n) => !n.isRead);
  const markAllAsRead = () => unread.forEach((n) => markAsRead(n.id));

  return { read, unread, markAsRead, markAllAsRead };
}
