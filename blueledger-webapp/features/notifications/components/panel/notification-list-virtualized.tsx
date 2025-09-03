import type { NotificationDisplay } from '../../schemas';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import NotificationItem from './notification-item';

function NotificationListVirtualized({
  notificationsList,
  setNotificationRead,
}: {
  notificationsList: NotificationDisplay[];
  setNotificationRead: (id: string) => Promise<NotificationDisplay>;
}) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: notificationsList.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // avg row height (px)
    overscan: 5,
  });

  return (
    <div>
      <ScrollArea className="notifications__scroll-area" ref={parentRef}>
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const notification = notificationsList[virtualItem.index];
            if (!notification)
              return null;

            return (
              <div
                key={notification?.id}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <NotificationItem
                  key={notification?.id}
                  notification={notification}
                  setNotificationRead={setNotificationRead}
                />
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

export default NotificationListVirtualized;
