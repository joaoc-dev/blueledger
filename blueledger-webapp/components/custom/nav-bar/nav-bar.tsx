import React from 'react';
import DesktopNavBar from './desktop-nav-bar';

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
  return (
    <>
      <div className="relative block md:hidden">
        {/* <MobileNavBar links={links} /> */}
      </div>
      <div className="hidden md:block">
        <DesktopNavBar links={links} />
      </div>
    </>
  );
};

export default NavBar;
