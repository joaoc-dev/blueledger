'use client';

import NotificationBellIcon from './notification-bell-icon';

interface MobileNotificationBellProps {
  onClick: () => void;
}

export default function MobileNotificationBell({
  onClick,
}: MobileNotificationBellProps) {
  return (
    <button className="relative icon-button" onClick={onClick}>
      <NotificationBellIcon />
    </button>
  );
}
