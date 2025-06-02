'use client';

import React from 'react';
import Link from 'next/link';
import { HandCoins } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { usePathname } from 'next/navigation';

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
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-between gap-4 p-4">
      <div className="flex items-center gap-12">
        <Link href="/" className="flex items-center gap-3">
          <HandCoins />
          <span className="text-2xl">Blue Ledger</span>
        </Link>
      </div>
      <ul className="flex items-center gap-16">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return renderMenuItem(link, isActive);
        })}
      </ul>
      <ThemeToggle />
    </nav>
  );
};

const renderMenuItem = (
  link: { label: string; href: string },
  isActive: boolean
) => {
  return (
    <li key={link.label}>
      <Link className={`${isActive ? 'text-blue-600' : ''}`} href={link.href}>
        {link.label}
      </Link>
    </li>
  );
};

export default NavBar;
