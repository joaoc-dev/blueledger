'use client';

import { HandCoins } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  MobileNotificationBell,
  MobileNotificationSheet,
} from '@/features/notifications/components';
import HamburgerButton from './hamburger-button';
import MobileNavMenu from './mobile-nav-menu';

interface MobileNavBarProps {
  links: { label: string; href: string }[];
}

function MobileNavBar({ links }: MobileNavBarProps) {
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen]
    = useState(false);

  const handleNavMenuClick = () => {
    setIsNavMenuOpen(!isNavMenuOpen);
    setIsNotificationDropdownOpen(false);
  };

  const handleNotificationDropdownClick = () => {
    setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
    setIsNavMenuOpen(false);
  };

  return (
    <div className="sticky top-0 z-50 border-b supports-[backdrop-filter]:bg-background/70 bg-background/90 mb-16">
      <div className="max-w-screen-xl mx-auto">
        <nav className="nav">
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
      </div>
    </div>
  );
}

export default MobileNavBar;
