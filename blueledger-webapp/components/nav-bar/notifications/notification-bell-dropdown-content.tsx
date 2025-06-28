import {
  DropdownMenuContent,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ListFilter } from 'lucide-react';
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { NotificationListVirtualized } from './notification-list-virtualized';
import {
  getNotifications,
  NotificationWithUser,
} from '@/lib/data/notifications.mock';
import { useEffect, useState } from 'react';
import { NotificationListAnimated } from './notification-list-animated';

export default function NotificationBellDropdownContent() {
  const [notificationsList, setNotificationsList] = useState<
    NotificationWithUser[]
  >([]);

  const setNotificationRead = (id: number) => {
    setNotificationsList(
      notificationsList.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const fetchNotifications = async () => {
    const notifications = await getNotifications();
    setNotificationsList(notifications);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <DropdownMenuContent
      className="w-(--radix-dropdown-menu-trigger-width) min-w-80"
      side="bottom"
      align="end"
      sideOffset={8}
    >
      <DropdownMenuLabel>
        <div className="flex items-center justify-between">
          Notifications
          {/* <Button variant="ghost" size="sm">
            Mark all as read
          </Button> */}
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      {/* <div className="flex items-center justify-between">
        <div>
          <Button variant="outline" size="sm">
            Unread
          </Button>
          <Button variant="ghost" size="sm">
            All
          </Button>
        </div>
        <ListFilter
          className="w-4 h-4"
          onClick={() => {
            console.log('clicked');
          }}
        />
      </div>
      <DropdownMenuSeparator /> */}
      {/* <NotificationListVirtualized
        notificationsList={notificationsList
          .filter((notif) => !notif.isRead)
          .map((notification) => notification)}
        setNotificationRead={setNotificationRead}
      /> */}

      <NotificationListAnimated
        notificationsList={notificationsList
          .filter((notif) => !notif.isRead)
          .map((notification) => notification)}
        setNotificationRead={setNotificationRead}
      />
    </DropdownMenuContent>
  );
}
