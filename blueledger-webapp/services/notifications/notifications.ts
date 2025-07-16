import { NotificationType } from '@/types/notification';
import { apiGet, apiPatch } from '../../lib/api-client';
import {
  NotificationApiResponse,
  NotificationMapper,
  NotificationApiRequest,
} from './notifications-mapper';

export async function markNotificationAsRead(
  id: string
): Promise<NotificationType> {
  const request: NotificationApiRequest = {
    isRead: true,
  };

  const response = await apiPatch<NotificationApiResponse>(
    `/notifications/${id}`,
    request
  );

  return NotificationMapper.toType(response);
}

export async function getNotifications(): Promise<NotificationType[]> {
  const response = await apiGet<NotificationApiResponse[]>('/notifications');
  return NotificationMapper.toTypeList(response);
}
