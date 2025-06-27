'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HandCoins } from 'lucide-react';
import { ThemeToggle } from '../theme-toggle';
import HamburgerButton from './hamburger-button';
import MobileNavMenu from './mobile-nav-menu';
import NotificationBell from '../notifications/notification-bell';

interface MobileNavBarProps {
  links: { label: string; href: string }[];
}

const MobileNavBar = ({ links }: MobileNavBarProps) => {
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);

  const handleClick = () => {
    setIsNavMenuOpen(!isNavMenuOpen);
  };

  return (
    <>
      <nav className="nav nav--mobile">
        <HamburgerButton isOpen={isNavMenuOpen} onClick={handleClick} />

        <Link href="/" className="icon-button">
          <HandCoins />
        </Link>

        <div className="flex items-center gap-4">
          <NotificationBell />
          <ThemeToggle />
        </div>
      </nav>
      <MobileNavMenu
        links={links}
        isOpen={isNavMenuOpen}
        onClose={handleClick}
      />
    </>
  );
};

export default MobileNavBar;
