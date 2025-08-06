import { Button } from '@/components/ui/button';
import { NotificationDisplay } from '../../schemas';

// TODO: Add actions by notification type
const NotificationActions = ({
  setNotificationRead,
  notification,
}: {
  setNotificationRead: (id: string) => Promise<NotificationDisplay>;
  notification: NotificationDisplay;
}) => {
  if (notification.isRead) {
    return null;
  }

  return (
    <Button
      className="px-2 underline text-xs"
      variant="ghost"
      size="sm"
      onClick={() => setNotificationRead(notification.id!)}
    >
      Mark as read
    </Button>
  );
};

export default NotificationActions;
