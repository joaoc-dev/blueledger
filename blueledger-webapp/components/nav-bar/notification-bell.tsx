// components/NotificationBell.tsx
'use client';

import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import { Bell, BellRing } from 'lucide-react';

export default function NotificationBell() {
  const [hasNotif, setHasNotif] = useState(false);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe('user-123');
    channel.bind('new-notification', () => {
      console.log('Notification received!');
      setHasNotif(true);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  return (
    <div className="icon-button">{hasNotif ? <BellRing /> : <Bell />}</div>
  );
}
