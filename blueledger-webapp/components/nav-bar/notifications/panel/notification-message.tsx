import { Badge } from '@/components/ui/badge';
import { NotificationType } from '@/types/notification';
import { NotificationTypes } from '@/constants/notification-type';

export const NotificationMessage = ({
  notification,
}: {
  notification: NotificationType;
}) => {
  switch (notification.type) {
    case NotificationTypes.FRIEND_REQUEST:
      return (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Sent you a</span>
          <Badge className="bg-green-400/10 dark:bg-green-400/20 hover:bg-green-400/10 text-green-500 border-green-400/60 shadow-none rounded-full">
            <span className="text-green-500">friend</span>
          </Badge>
          <span>request</span>
        </div>
      );
    case NotificationTypes.ADDED_TO_EXPENSE:
      return (
        <>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Added you to a new</span>
            <Badge className="bg-amber-500/10 dark:bg-amber-500/20 hover:bg-amber-400/10 text-amber-500 border-amber-400/60 shadow-none rounded-full">
              <span className="text-amber-500">Expense</span>
            </Badge>
          </div>
        </>
      );
    case NotificationTypes.GROUP_INVITE:
      return (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Invited you to a</span>
          <Badge className="bg-sky-400/10 dark:bg-sky-400/20 hover:bg-sky-400/10 text-sky-500 border-sky-400/60 shadow-none rounded-full">
            <span className="text-sky-500">group</span>
          </Badge>
        </div>
      );
  }
};
