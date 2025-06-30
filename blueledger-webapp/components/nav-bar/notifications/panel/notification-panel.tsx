import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotificationListAnimated } from '@/components/nav-bar/notifications/panel/notification-list-animated';
import { NotificationListVirtualized } from '@/components/nav-bar/notifications/panel/notification-list-virtualized';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useNotifications } from '@/hooks/use-notifications';
import { Mails } from 'lucide-react';

const NotificationPanel = () => {
  const { read, unread, markAsRead, markAllAsRead } = useNotifications();

  const tabs = [
    { value: 'unread', name: 'Unread' },
    { value: 'read', name: 'Read' },
  ];

  return (
    <div className="h-full">
      <div className="flex items-center justify-between">
        <span className="text-lg px-2">Notifications</span>
        <Button
          onClick={markAllAsRead}
          className="px-2 underline"
          variant="ghost"
          size="sm"
        >
          Mark all as read
        </Button>
      </div>
      <Separator />

      <Tabs
        defaultValue={tabs[0].value}
        className="flex h-full w-full flex-col py-2"
      >
        <TabsList className="w-full">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              <span className="text-sm">{tab.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent
          className="h-full mb-2"
          key={tabs[0].value}
          value={tabs[0].value}
        >
          {unread.length > 0 ? (
            <NotificationListAnimated
              notificationsList={unread}
              setNotificationRead={markAsRead}
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-sm text-gray-400">
              <Mails className="h-10 w-10" />
            </div>
          )}
        </TabsContent>

        <TabsContent
          className="h-full"
          key={tabs[1].value}
          value={tabs[1].value}
        >
          {read.length > 0 ? (
            <NotificationListVirtualized
              notificationsList={read}
              setNotificationRead={markAsRead}
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-sm text-gray-400">
              <Mails className="h-10 w-10" />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationPanel;
