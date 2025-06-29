'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HandCoins } from 'lucide-react';
import { ThemeToggle } from '../theme-toggle';
import HamburgerButton from './hamburger-button';
import MobileNavMenu from './mobile-nav-menu';
import MobileNotificationBell from '../notifications/mobile-notification-bell';
import MobileNotificationSheet from '../notifications/mobile-notification-sheet';

interface MobileNavBarProps {
  links: { label: string; href: string }[];
}

const MobileNavBar = ({ links }: MobileNavBarProps) => {
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);

  const handleNavMenuClick = () => {
    setIsNavMenuOpen(!isNavMenuOpen);
    setIsNotificationDropdownOpen(false);
  };

  const handleNotificationDropdownClick = () => {
    setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
    setIsNavMenuOpen(false);
  };

  return (
    <>
      <nav className="nav nav--mobile">
        <HamburgerButton isOpen={isNavMenuOpen} onClick={handleNavMenuClick} />

        <Link
          href="/"
          className="icon-button absolute left-1/2 -translate-x-1/2"
        >
          <HandCoins />
        </Link>

        <div className="flex items-center gap-4">
          <MobileNotificationBell onClick={handleNotificationDropdownClick} />
          <ThemeToggle />
        </div>
      </nav>
      <MobileNavMenu
        links={links}
        isOpen={isNavMenuOpen}
        onClose={handleNavMenuClick}
      />
      <MobileNotificationSheet
        isOpen={isNotificationDropdownOpen}
        onClose={handleNotificationDropdownClick}
      />
    </>
  );
};

export default MobileNavBar;
