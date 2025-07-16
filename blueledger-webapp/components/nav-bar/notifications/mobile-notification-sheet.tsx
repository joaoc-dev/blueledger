'use client';

import NotificationPanel from './panel/notification-panel';

interface MobileNotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNotificationSheet = ({
  isOpen,
  onClose,
}: MobileNotificationDropdownProps) => {
  return (
    <>
      <ul
        className={`nav__sheet px-4 py-2 h-120 ${
          isOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <NotificationPanel />
      </ul>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default MobileNotificationSheet;
