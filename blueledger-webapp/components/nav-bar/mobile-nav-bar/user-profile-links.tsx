'use client';

import { Separator } from '@/components/ui/separator';
import UserAvatar from '@/components/nav-bar/user-avatar';
import Link from 'next/link';
import React from 'react';
import { BadgeCheck, Bell, CreditCard, LogOut, Sparkles } from 'lucide-react';
import { signOut } from 'next-auth/react';
import useUserStore from '@/app/(protected)/store';

interface UserProfileLinksProps {
  onClose: () => void;
  pathname: string;
}

const UserProfileLinks = ({ onClose, pathname }: UserProfileLinksProps) => {
  const name = useUserStore((state) => state.name);
  const email = useUserStore((state) => state.email);

  return (
    <ul className="flex flex-col gap-4">
      <Separator className="" />
      <li className="px-6">
        <div className="flex items-center gap-3 text-left text-sm">
          <UserAvatar />
          <div className="flex flex-col text-left text-sm leading-tight">
            <span className="truncate font-semibold">{name}</span>
            <span className="truncate text-xs">{email}</span>
          </div>
        </div>
      </li>
      <Separator className="" />
      <li className="flex flex-col gap-3">
        <Link
          onClick={onClose}
          href={pathname}
          className="flex items-center gap-2"
        >
          <Sparkles className="size-4" />
          <span>Upgrade to Pro (soon)</span>
        </Link>
      </li>
      <Separator />
      <li>
        <Link
          onClick={onClose}
          href="/user/profile"
          className="flex items-center gap-2"
        >
          <BadgeCheck className="size-4" />
          <span>Profile</span>
        </Link>
      </li>
      <li>
        <Link
          onClick={onClose}
          href={pathname}
          className="flex items-center gap-2"
        >
          <CreditCard className="size-4" />
          <span>Billing (soon)</span>
        </Link>
      </li>
      <li className="flex flex-col gap-3">
        <Link
          onClick={onClose}
          href={pathname}
          className=" flex items-center gap-2"
        >
          <Bell className="size-4" />
          <span>Notifications (soon)</span>
        </Link>
      </li>
      <Separator />
      <li>
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            signOut();
            onClose();
          }}
          className="flex items-center gap-2"
        >
          <LogOut className="size-4" />
          <span>Log out</span>
        </Link>
      </li>
    </ul>
  );
};

export default UserProfileLinks;
