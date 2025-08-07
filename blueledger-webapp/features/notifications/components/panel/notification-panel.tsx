import { Mails } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNotifications } from '../../hooks';
import NotificationListAnimated from './notification-list-animated';
import NotificationListVirtualized from './notification-list-virtualized';

function NotificationPanel() {
  const { read, unread, markAsReadMutation, markAllAsReadMutation }
    = useNotifications();

  const tabs = [
    { value: 'unread', name: 'Unread' },
    { value: 'read', name: 'Read' },
  ];

  return (
    <div className="h-full">
      <div className="flex items-center justify-between">
        <span className="text-lg px-2">Notifications</span>
        <Button
          onClick={() => markAllAsReadMutation.mutateAsync()}
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
          {tabs.map(tab => (
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
          {unread && unread.length > 0
            ? (
                <NotificationListAnimated
                  notificationsList={unread}
                  setNotificationRead={markAsReadMutation.mutateAsync}
                />
              )
            : (
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
          {read && read.length > 0
            ? (
                <NotificationListVirtualized
                  notificationsList={read}
                  setNotificationRead={markAsReadMutation.mutateAsync}
                />
              )
            : (
                <div className="grid h-full w-full place-items-center text-sm text-gray-400">
                  <Mails className="h-10 w-10" />
                </div>
              )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default NotificationPanel;
