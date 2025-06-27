'use client';

import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import { Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import NotificationBellDropdownContent from './notification-bell-dropdown-content';

export default function NotificationBell() {
  const [hasNotification, setHasNotification] = useState(false);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe('user-123');
    channel.bind('new-notification', () => {
      console.log('Notification received!');
      setHasNotification(true);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  return (
    <div className="relative">
      <div className="icon-button">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Bell />
          </DropdownMenuTrigger>
          <NotificationBellDropdownContent />
        </DropdownMenu>
      </div>
      {hasNotification && (
        <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
      )}
    </div>
  );
}
