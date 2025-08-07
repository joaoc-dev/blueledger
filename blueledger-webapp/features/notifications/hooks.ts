import type { NotificationDisplay } from './schemas';

import { useMutation, useQuery } from '@tanstack/react-query';
import { notificationKeys } from '@/constants/query-keys';
import { getQueryClient } from '@/lib/react-query/get-query-client';
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from './client';

export function useNotifications() {
  const queryClient = getQueryClient();
  const {
    data: notifications,
    isLoading,
    isError,
    refetch,
  } = useQuery<NotificationDisplay[]>({
    queryKey: notificationKeys.byUser,
    queryFn: getNotifications,
  });

  const read = notifications?.filter(n => n.isRead);
  const unread = notifications?.filter(n => !n.isRead);

  // Mutations: Optimistic with manual cache manipulation
  // IMPORTANT: Query invalidation on settled
  // We use query invalidation because -
  // Mark A as read, mark B as read
  // Both error, but A error comes first and we restore context to A, B
  // but then B error comes in and we restore context to B, where's A?
  // Added complexity of possibly receiving new notifications while marking as read
  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,

    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.byUser });

      const unreadNotification = unread?.find(n => n.id === id);

      if (!unreadNotification) {
        throw new Error('Notification not found');
      }

      const optimisticNotification: NotificationDisplay = {
        ...unreadNotification,
        isRead: true,
        updatedAt: new Date(),
        id,
      };

      const previousNotifications
        = queryClient.getQueryData<NotificationDisplay[]>(
          notificationKeys.byUser,
        ) || [];

      const updatedNotifications = previousNotifications.map(notification =>
        notification.id === id ? optimisticNotification : notification,
      );

      queryClient.setQueryData<NotificationDisplay[]>(
        notificationKeys.byUser,
        updatedNotifications,
      );
    },

    onError: (err) => {
      console.error('Failed to mark notification as read:', err);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.byUser });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.byUser });

      const previousNotifications
        = queryClient.getQueryData<NotificationDisplay[]>(
          notificationKeys.byUser,
        ) || [];

      const updatedNotifications = previousNotifications.map(notification =>
        notification.isRead ? notification : { ...notification, isRead: true },
      );

      queryClient.setQueryData<NotificationDisplay[]>(
        notificationKeys.byUser,
        updatedNotifications,
      );
    },

    onError: (err) => {
      console.error('Failed to mark all notifications as read:', err);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.byUser });
    },
  });

  return {
    notifications,
    isLoading,
    isError,
    refetch,
    read,
    unread,
    markAsReadMutation,
    markAllAsReadMutation,
  };
}
