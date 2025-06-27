import { NotificationWithUser } from '@/lib/data/notifications.mock';
import { ScrollArea } from '@/components/custom/scroll-area';
import { AnimatePresence, motion } from 'motion/react';
import { NotificationItem } from './notification-item';

export const NotificationList = ({
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
                key={n.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <NotificationItem
                  key={n.id}
                  notification={n}
                  setNotificationRead={setNotificationRead}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </ScrollArea>
    </div>
  );
};
