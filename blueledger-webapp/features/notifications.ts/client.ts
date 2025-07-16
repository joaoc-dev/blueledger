import { NotificationDisplay } from '@/features/notifications.ts/schemas';
import { apiGet, apiPatch } from '../../lib/api-client';
import { NotificationApiResponse } from './schemas';
import {
  mapApiResponseListToDisplay,
  mapApiResponseToDisplay,
} from './mapper-client';

const endpoint = '/notifications';

export async function markNotificationAsRead(
  id: string
): Promise<NotificationDisplay> {
  const response = await apiPatch<NotificationApiResponse>(
    `${endpoint}/${id}`,
    { isRead: true }
  );

  return mapApiResponseToDisplay(response);
}

export async function markAllNotificationsAsRead(): Promise<void> {
  const response = await apiPatch<{ success: boolean }>(
    `${endpoint}/mark-all-read`
  );

  if (response.success) {
    throw new Error('Failed to mark all notifications as read');
  }
}

export async function getNotifications(): Promise<NotificationDisplay[]> {
  const response = await apiGet<NotificationApiResponse[]>(endpoint);
  return mapApiResponseListToDisplay(response);
}
