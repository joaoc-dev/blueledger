import { NotificationWithUser } from '@/lib/data/notifications.mock';
import { ScrollArea } from '@/components/custom/scroll-area';
import { AnimatePresence, motion } from 'motion/react';
import { NotificationItem } from './notification-item';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

export const NotificationListAnimated = ({
  notificationsList,
  setNotificationRead,
}: {
  notificationsList: NotificationWithUser[];
  setNotificationRead: (id: number) => void;
}) => {
  return (
    <div>
      <ScrollArea className="h-96 w-full">
        <AnimatePresence>
          {notificationsList.map((n) => {
            return (
              <motion.div
                layout
                key={n.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
              >
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <NotificationItem
                    notification={n}
                    setNotificationRead={setNotificationRead}
                  />
                </DropdownMenuItem>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </ScrollArea>
    </div>
  );
};
