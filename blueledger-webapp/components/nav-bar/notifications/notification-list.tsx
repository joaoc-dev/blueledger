import { NotificationWithUser } from '@/lib/data/notifications.mock';
import { ScrollArea } from '@/components/custom/scroll-area';
import { NotificationItem } from './notification-item';

export const NotificationList = ({
  notificationsList,
  setNotificationRead,
}: {
  notificationsList: NotificationWithUser[];
  setNotificationRead: (id: number) => void;
}) => {
  return (
    <div>
      <ScrollArea className="h-96 w-full">
        {notificationsList.map((n) => {
          return (
            <NotificationItem
              key={n.id}
              notification={n}
              setNotificationRead={setNotificationRead}
            />
          );
        })}
      </ScrollArea>
    </div>
  );
};
