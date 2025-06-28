import { NotificationWithUser } from '@/lib/data/notifications.mock';
import { Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { NotificationMessage } from './notification-message';
import NotificationActions from './notification-actions';

export const NotificationItem = ({
  notification,
  setNotificationRead,
}: {
  notification: NotificationWithUser;
  setNotificationRead: (id: number) => void;
}) => {
  return (
    <div>
      <div className="grid grid-cols-[auto_1fr] gap-2 px-2 py-1">
        <img
          src={notification.userImage}
          alt={notification.userName}
          className="w-12 h-12 rounded-full"
        />
        <div className="flex flex-col gap-3 px-2">
          <div className="flex flex-col">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold">{notification.userName}</p>

              <NotificationMessage notification={notification} />
            </div>
          </div>
          <NotificationActions
            notification={notification}
            setNotificationRead={setNotificationRead}
          />
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-4 h-4" />
            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
          </div>
        </div>
      </div>
    </div>
  );
};
