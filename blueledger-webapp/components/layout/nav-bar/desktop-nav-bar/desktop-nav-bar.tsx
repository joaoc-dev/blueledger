'use client';

import { HandCoins } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { useEventListener } from 'usehooks-ts';
import { ThemeToggle } from '@/components/theme-toggle';
import { DesktopNotificationBell } from '@/features/notifications/components';
import { cn } from '@/lib/utils';
import { DesktopNavUser } from './desktop-nav-user';

interface DesktopNavBarProps {
  links: { label: string; href: string }[];
}

function DesktopNavBar({ links }: DesktopNavBarProps) {
  const pathname = usePathname();
  const activeLinkRef = useRef<HTMLAnchorElement>(null);
  const navListRef = useRef<HTMLUListElement>(null);
  const [underlineX, setUnderlineX] = useState(0);
  const [underlineW, setUnderlineW] = useState(0);

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
    else {
      setUnderlineW(0);
    }
  };

  useEventListener('resize', renderUnderline);

  useLayoutEffect(() => {
    renderUnderline();
  }, [pathname]);

  return (
    <nav className="nav">
      <div>
        <Link href="/" className="nav__brand nav__item hover:text-foreground">
          <HandCoins />
          <span className="text-2xl">BlueLedger</span>
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
                className={cn(
                  'nav__item hover:text-foreground',
                  isActive && 'text-foreground',
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
        <DesktopNotificationBell />
        <DesktopNavUser />
        <ThemeToggle />
      </div>
    </nav>
  );
}

export default DesktopNavBar;
