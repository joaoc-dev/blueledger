import { NotificationTypeKey } from '@/constants/notification-type';
import { UserType } from './user';

export interface NotificationType {
  id: string;
  user: Partial<UserType>;
  fromUser: Partial<UserType>;
  type: NotificationTypeKey;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
