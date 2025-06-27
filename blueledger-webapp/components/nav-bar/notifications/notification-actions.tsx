import { NotificationTypes } from '@/lib/data/notifications.mock';
import { Button } from '@/components/ui/button';
import { NotificationWithUser } from '@/lib/data/notifications.mock';

const NotificationActions = ({
  notification,
  setNotificationRead,
}: {
  notification: NotificationWithUser;
  setNotificationRead: (id: number) => void;
}) => {
  return (
    <div className="flex items-center gap-2">
      {notification.type === NotificationTypes.FRIEND_REQUEST && (
        <>
          <Button
            className="h-6 text-xs w-16"
            onClick={() => {
              setNotificationRead(notification.id);
            }}
          >
            Accept
          </Button>
          <Button
            variant="outline"
            className="h-6 text-xs w-16"
            onClick={() => {
              setNotificationRead(notification.id);
            }}
          >
            Decline
          </Button>
        </>
      )}
      {notification.type === NotificationTypes.ADDED_TO_EXPENSE && (
        <Button
          className="h-6 text-xs w-16"
          onClick={() => {
            setNotificationRead(notification.id);
          }}
        >
          View
        </Button>
      )}
      {notification.type === NotificationTypes.GROUP_INVITE && (
        <>
          <Button
            className="h-6 text-xs w-16"
            onClick={() => {
              setNotificationRead(notification.id);
            }}
          >
            Accept
          </Button>
          <Button
            variant="outline"
            className="h-6 text-xs w-16"
            onClick={() => {
              setNotificationRead(notification.id);
            }}
          >
            Decline
          </Button>
        </>
      )}
    </div>
  );
};

export default NotificationActions;
