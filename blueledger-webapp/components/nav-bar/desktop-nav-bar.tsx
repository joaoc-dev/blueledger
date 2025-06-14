'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { HandCoins } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { usePathname } from 'next/navigation';
// import UserAvatar from './user-avatar';
import { Button } from '../ui/button';
// import { signIn, signOut } from '@/lib/auth/auth';
import { signIn, signOut } from 'next-auth/react';
import { User } from 'next-auth';

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
                className={`nav__item hover:text-foreground ${
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                }`}
                href={link.href}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="flex items-center gap-2">
        {user ? (
          <div className="flex items-center gap-2">
            <span>{user.name}</span>
            <Button onClick={() => signOut()}>Sign out</Button>
          </div>
        ) : (
          <Button onClick={() => signIn()}>Sign in</Button>
        )}
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default DesktopNavBar;
