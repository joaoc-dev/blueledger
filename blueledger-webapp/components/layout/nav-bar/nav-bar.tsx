'use client';

import { useIsMobile } from '@/hooks/useIsMobile';
import { DesktopNavBar } from './desktop-nav-bar';
import { MobileNavBar } from './mobile-nav-bar';

const links = [
  {
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    label: 'Expenses',
    href: '/expenses',
  },
  {
    label: 'Groups',
    href: '/groups',
  },
  {
    label: 'Friends',
    href: '/friends',
  },
];

const NavBar = () => {
  const isMobile = useIsMobile();

  if (typeof window === 'undefined') return null;

  return isMobile ? (
    <div className="relative">
      <MobileNavBar links={links} />
    </div>
  ) : (
    <DesktopNavBar links={links} />
  );
};

export default NavBar;
