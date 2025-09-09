import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotifications } from '../hooks';

function NotificationBellIcon({ ref, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { ref?: React.RefObject<HTMLDivElement | null> }) {
  const { unread } = useNotifications();

  return (
    <div ref={ref} className={cn('relative icon-button', className)} {...props}>
      <Bell />
      {unread && unread.length > 0 && (
        <span className="absolute top-0 right-0 px-1 min-w-4 flex items-center justify-center rounded-full text-xs bg-destructive text-destructive-foreground">
          {unread.length}
        </span>
      )}
    </div>
  );
}

NotificationBellIcon.displayName = 'NotificationBellIcon';

export default NotificationBellIcon;
