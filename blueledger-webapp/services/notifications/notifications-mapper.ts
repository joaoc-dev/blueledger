import { NotificationType } from '@/types/notification';
import { UserType } from '@/types/user';

export interface NotificationApiResponse {
  id: string;
  user: Partial<UserType>;
  fromUser: Partial<UserType>;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}
