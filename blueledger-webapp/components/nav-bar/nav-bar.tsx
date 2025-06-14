import React from 'react';
import DesktopNavBar from './desktop-nav-bar';
import MobileNavBar from './mobile-nav-bar';
import { auth } from '@/lib/auth/auth';

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

const NavBar = async () => {
  const session = await auth();

  return (
    <>
      <div className="relative block md:hidden">
        <MobileNavBar links={links} user={session?.user} />
      </div>
      <div className="hidden md:block">
        <DesktopNavBar links={links} user={session?.user} />
      </div>
    </>
  );
};

export default NavBar;
