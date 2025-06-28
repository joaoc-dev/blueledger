import { NotificationWithUser } from '@/lib/data/notifications.mock';
import { ScrollArea } from '@/components/custom/scroll-area';
import { NotificationItem } from './notification-item';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

export const NotificationListVirtualized = ({
  notificationsList,
  setNotificationRead,
}: {
  notificationsList: NotificationWithUser[];
  setNotificationRead: (id: number) => void;
}) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: notificationsList.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 130, // avg row height (px)
    overscan: 5,
  });

  console.log(
    'virtual items ->',
    rowVirtualizer.getVirtualItems().length,
    ' / total -> ',
    notificationsList.length
  );

  return (
    <div>
      <ScrollArea className="h-96 w-full" ref={parentRef}>
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const n = notificationsList[virtualItem.index];
            return (
              <div
                key={n.id}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <DropdownMenuItem
                  key={n.id}
                  onSelect={(e) => e.preventDefault()}
                >
                  <NotificationItem
                    key={n.id}
                    notification={n}
                    setNotificationRead={setNotificationRead}
                  />
                </DropdownMenuItem>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
