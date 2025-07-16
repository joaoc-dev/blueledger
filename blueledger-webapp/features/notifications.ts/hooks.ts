import {
  getNotifications,
  markNotificationAsRead,
} from '@/features/notifications.ts/client';

import { getQueryClient } from '@/lib/react-query/get-query-client';
import { notificationKeys } from '@/constants/query-keys';
import { useQuery } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { NotificationDisplay } from '@/features/notifications.ts/schemas';

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

  const read = notifications?.filter((n) => n.isRead);
  const unread = notifications?.filter((n) => !n.isRead);

  // Mutations: Optimistic with manual cache manipulation but query invalidation on settled
  // We use query invalidation because of this:
  // Mark A as read, mark B as read
  // Both error, but A error comes first and we restore context to A, B
  // but then B error comes in and we restore context to B, where's A?
  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,

    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.byUser });

      const optimisticNotification: NotificationDisplay = {
        ...unread?.find((n) => n.id === id)!,
        isRead: true,
        updatedAt: new Date(),
        id,
      };

      const previousNotifications =
        queryClient.getQueryData<NotificationDisplay[]>(
          notificationKeys.byUser
        ) || [];

      const updatedNotifications = previousNotifications.map((notification) =>
        notification.id === id ? optimisticNotification : notification
      );

      queryClient.setQueryData<NotificationDisplay[]>(
        notificationKeys.byUser,
        updatedNotifications
      );
    },

    onError: (err, id, context) => {
      console.error('Failed to mark notification as read:', err);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.byUser });
    },
  });

  // const markAllAsRead = () => unread?.forEach((n) => markAsRead(n.id));

  return {
    notifications,
    isLoading,
    isError,
    refetch,
    read,
    unread,
    markAsReadMutation,
  };
}
