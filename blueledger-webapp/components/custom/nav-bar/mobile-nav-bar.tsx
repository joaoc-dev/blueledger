'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HandCoins, Moon } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import HamburgerButton from './hamburger-button';
import MobileNavMenu from './mobile-nav-menu';

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

        <Link href="/" className="nav__brand nav__item hover:text-foreground">
          <HandCoins />
        </Link>
        <ThemeToggle />
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
