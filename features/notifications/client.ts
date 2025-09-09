import type { NotificationApiResponse } from './schemas';
import type { NotificationDisplay } from '@/features/notifications/schemas';
import { apiGet, apiPatch } from '@/lib/api-client';
import {
  mapApiResponseListToDisplay,
  mapApiResponseToDisplay,
} from './mapper-client';

const endpoint = '/notifications';

export async function markNotificationAsRead(
  id: string,
): Promise<NotificationDisplay> {
  const response = await apiPatch<NotificationApiResponse>(
    `${endpoint}/${id}`,
    { isRead: true },
  );

  return mapApiResponseToDisplay(response);
}

export async function markAllNotificationsAsRead(): Promise<void> {
  return await apiPatch<void>(`${endpoint}/mark-all-read`);
}

export async function getNotifications(): Promise<NotificationDisplay[]> {
  const response = await apiGet<NotificationApiResponse[]>(endpoint);
  return mapApiResponseListToDisplay(response);
}
