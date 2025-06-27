import { Badge } from '@/components/ui/badge';
import {
  NotificationTypes,
  NotificationWithUser,
} from '@/lib/data/notifications.mock';

export const NotificationMessage = ({
  notification,
}: {
  notification: NotificationWithUser;
}) => {
  switch (notification.type) {
    case NotificationTypes.FRIEND_REQUEST:
      return (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Sent you a</span>
          <Badge className="bg-green-400 text-foreground">friend</Badge>
          <span>request</span>
        </div>
      );
    case NotificationTypes.ADDED_TO_EXPENSE:
      return (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Added you to an new</span>
          <Badge className="bg-amber-400 text-foreground">expense</Badge>
        </div>
      );
    case NotificationTypes.GROUP_INVITE:
      return (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Invited you to a</span>
          <Badge className="bg-sky-400 text-foreground">group</Badge>
        </div>
      );
  }
};
