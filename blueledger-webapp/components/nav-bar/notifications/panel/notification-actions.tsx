import { Button } from '@/components/ui/button';
import { NotificationWithUser } from '@/lib/data/notifications.mock';

// TODO: Add actions for notifications
const NotificationActions = ({
  setNotificationRead,
  notification,
}: {
  setNotificationRead: (id: number) => void;
  notification: NotificationWithUser;
}) => {
  if (notification.isRead) {
    return null;
  }

  return (
    <Button
      className="px-2 underline text-xs"
      variant="ghost"
      size="sm"
      onClick={() => setNotificationRead(notification.id)}
    >
      Mark as read
    </Button>
  );
};

export default NotificationActions;
