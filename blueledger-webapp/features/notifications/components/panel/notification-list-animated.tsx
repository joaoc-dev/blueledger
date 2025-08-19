import type { NotificationDisplay } from '../../schemas';
import { AnimatePresence, motion } from 'motion/react';
import { ScrollArea } from '@/components/ui/scroll-area';
import NotificationItem from './notification-item';

function NotificationListAnimated({
  notificationsList,
  setNotificationRead,
}: {
  notificationsList: NotificationDisplay[];
  setNotificationRead: (id: string) => Promise<NotificationDisplay>;
}) {
  return (
    <div>
      <ScrollArea className="notifications__scroll-area">
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
                <NotificationItem
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
}

export default NotificationListAnimated;
