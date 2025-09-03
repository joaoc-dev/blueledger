import type { NotificationDisplay } from '../../schemas';
import { formatDistanceToNow } from 'date-fns';
import { Clock, UserRound } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import NotificationActions from './notification-actions';
import NotificationMessage from './notification-message';

function NotificationItem({
  notification,
  setNotificationRead,
}: {
  notification: NotificationDisplay;
  setNotificationRead: (id: string) => Promise<NotificationDisplay>;
}) {
  return (
    <div>
      <div className="grid grid-cols-[auto_1fr] gap-2 px-2 py-1 h-25">
        <Avatar className="w-12 h-12">
          <AvatarImage src={notification.fromUser.image || ''} />
          <AvatarFallback>
            <UserRound />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-3 px-2">
          <div className="flex flex-col">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold">
                {notification.fromUser.name}
              </p>

              <NotificationMessage notification={notification} />
            </div>
          </div>

          <div className="flex items-center gap-1 justify-between h-6">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-4 h-4" />
              {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
            </div>
            <NotificationActions
              notification={notification}
              setNotificationRead={setNotificationRead}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationItem;
