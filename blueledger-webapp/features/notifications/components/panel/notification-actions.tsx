import type { NotificationDisplay } from '../../schemas';
import { Button } from '@/components/ui/button';

// TODO: Add actions by notification type
function NotificationActions({
  setNotificationRead,
  notification,
}: {
  setNotificationRead: (id: string) => Promise<NotificationDisplay>;
  notification: NotificationDisplay;
}) {
  if (notification.isRead) {
    return null;
  }

  const handleMarkAsRead = async () => {
    try {
      await setNotificationRead(notification.id!);
    }
    catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  return (
    <Button
      className="px-2 underline text-xs"
      variant="ghost"
      size="sm"
      onClick={handleMarkAsRead}
    >
      Mark as read
    </Button>
  );
}

export default NotificationActions;
