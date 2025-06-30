import { Button } from '@/components/ui/button';
import { NotificationType } from '@/types/notification';

// TODO: Add actions by notification type
const NotificationActions = ({
  setNotificationRead,
  notification,
}: {
  setNotificationRead: (id: string) => void;
  notification: NotificationType;
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
