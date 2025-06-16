'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HandCoins } from 'lucide-react';
import { ThemeToggle } from '../theme-toggle';
import HamburgerButton from './hamburger-button';
import MobileNavMenu from './mobile-nav-menu';
import { User } from 'next-auth';

interface MobileNavBarProps {
  links: { label: string; href: string }[];
  user: User | undefined;
}

const MobileNavBar = ({ links, user }: MobileNavBarProps) => {
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

        <ThemeToggle />
      </nav>
      <MobileNavMenu
        links={links}
        isOpen={isNavMenuOpen}
        onClose={handleClick}
        user={user}
      />
    </>
  );
};

export default MobileNavBar;
