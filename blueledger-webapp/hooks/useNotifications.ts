import { useEffect, useState, useCallback } from 'react';
// import {
//   getNotifications,
//   NotificationWithUser,
// } from '@/lib/data/notifications.mock';
import { NotificationTypes } from '@/constants/notification-type';
import { getNotifications } from '@/services/notifications/notifications';

import Pusher from 'pusher-js';
import { NotificationType } from '@/types/notification';
import { getExpenses } from '@/services/expenses/expenses';
import { getQueryClient } from '@/lib/react-query/get-query-client';
import { useQuery } from '@tanstack/react-query';

export function useNotifications() {
  const {
    data: notifications,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
  });

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

  const read = notifications?.filter((n) => n.isRead);
  const unread = notifications?.filter((n) => !n.isRead);

  // const markAsRead = useCallback((id: string) => {
  //   // setItems((prev) =>
  //   //   prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
  //   // );
  // }, []);
  // const markAllAsRead = () => unread?.forEach((n) => markAsRead(n.id));

  return { notifications, isLoading, isError, refetch, read, unread };
}
