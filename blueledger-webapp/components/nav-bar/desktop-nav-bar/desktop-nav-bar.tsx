'use client';

import { HandCoins } from 'lucide-react';
import { User } from 'next-auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { ThemeToggle } from '../theme-toggle';
import { DesktopNavUser } from './desktop-nav-user';
import clsx from 'clsx';

interface DesktopNavBarProps {
  links: { label: string; href: string }[];
  user: User | undefined;
}

const DesktopNavBar = ({ links, user }: DesktopNavBarProps) => {
  const pathname = usePathname();
  const activeLinkRef = useRef<HTMLAnchorElement>(null);
  const navListRef = useRef<HTMLUListElement>(null);
  const [underlineX, setUnderlineX] = useState(0);
  const [underlineW, setUnderlineW] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      renderUnderline();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    renderUnderline();
  }, [pathname]);

  const renderUnderline = () => {
    const activeLinkElement = activeLinkRef.current;
    const navListElement = navListRef.current;

    if (activeLinkElement) {
      setUnderlineX(activeLinkElement.offsetLeft);

      if (navListElement) {
        const navListWidth = navListElement.offsetWidth;
        const linkWidth = activeLinkElement.offsetWidth;

        setUnderlineW(linkWidth / navListWidth);
      }
    } else {
      setUnderlineW(0);
    }
  };

  return (
    <nav className="nav">
      <div>
        <Link href="/" className="nav__brand nav__item hover:text-foreground">
          <HandCoins />
          <span className="text-2xl">Blue Ledger</span>
        </Link>
      </div>
      <ul
        className="nav__list--desktop lg:gap-12"
        ref={navListRef}
        style={
          {
            '--nav-underline-x': `${underlineX}px`,
            '--nav-underline-w': `${underlineW}`,
          } as React.CSSProperties
        }
      >
        {links.map((link) => {
          const isActive = pathname === link.href;

          return (
            <li key={link.label}>
              <Link
                ref={isActive ? activeLinkRef : null}
                className={clsx(
                  'nav__item hover:text-foreground',
                  isActive && 'text-foreground'
                )}
                href={link.href}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="flex items-center gap-2">
        {user && <DesktopNavUser user={user} />}
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default DesktopNavBar;
