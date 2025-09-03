'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import NotificationBellIcon from './notification-bell-icon';
import NotificationPanel from './panel/notification-panel';

export default function DesktopNotificationBell() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <NotificationBellIcon />
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-dropdown-menu-trigger-width) h-120 min-w-86 px-3 py-2"
        side="bottom"
        align="end"
        sideOffset={8}
      >
        <NotificationPanel />
      </PopoverContent>
    </Popover>
  );
}
