'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import UserAvatar from '../user-avatar';
import { User } from 'next-auth';
import { BadgeCheck, Bell, CreditCard, LogOut, Sparkles } from 'lucide-react';

interface MobileNavMenuProps {
  links: { label: string; href: string }[];
  isOpen: boolean;
  onClose: () => void;
  user: User | undefined;
}

const MobileNavMenu = ({
  links,
  isOpen,
  onClose,
  user,
}: MobileNavMenuProps) => {
  const pathname = usePathname();

  return (
    <>
      <ul
        className={`nav__list--mobile ${
          isOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        {links.map((link) => {
          const isActive = pathname === link.href;

          return (
            <li key={link.label}>
              <Link
                onClick={onClose}
                className={`nav__item px-6 py-2 hover:text-foreground ${
                  isActive
                    ? 'text-foreground border-l border-foreground'
                    : 'text-muted-foreground'
                }`}
                href={link.href}
              >
                {link.label}
              </Link>
            </li>
          );
        })}

        {user && (
          <>
            <li className="flex flex-col gap-3">
              <Separator />
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserAvatar user={user} />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
              <Separator />
            </li>

            <li className="flex flex-col gap-3">
              <Link
                onClick={onClose}
                href={pathname}
                className="flex items-center gap-2"
              >
                <Sparkles />
                Upgrade to Pro(soon)
              </Link>
              <Separator />
            </li>

            <li>
              <Link
                onClick={onClose}
                href="/user/profile"
                className="flex items-center gap-2"
              >
                <BadgeCheck />
                Profile
              </Link>
            </li>
            <li>
              <Link
                onClick={onClose}
                href={pathname}
                className="flex items-center gap-2"
              >
                <CreditCard />
                <span>Billing(soon)</span>
              </Link>
            </li>
            <li className="flex flex-col gap-3">
              <Link
                onClick={onClose}
                href={pathname}
                className=" flex items-center gap-2"
              >
                <Bell />
                Notifications(soon)
              </Link>
              <Separator />
            </li>
            <li>
              <Link
                onClick={onClose}
                href={pathname}
                className="flex items-center gap-2"
              >
                <LogOut />
                Logout
              </Link>
            </li>
          </>
        )}
      </ul>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default MobileNavMenu;
