'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Slot } from '@radix-ui/react-slot';
import { UserRound } from 'lucide-react';
import React from 'react';
import { useUserStore } from './store';

type UserAvatarProps = {
  asChild?: boolean;
} & React.ComponentProps<typeof Avatar>;

const UserAvatar = React.forwardRef<HTMLDivElement, UserAvatarProps>(
  ({ asChild, className, ...props }, ref) => {
    const Comp = asChild ? Slot : Avatar;
    const image = useUserStore((state) => state.image);

    return (
      <Comp className={className} ref={ref} {...props}>
        <AvatarImage src={image} alt="User avatar" />
        <AvatarFallback>
          <UserRound />
        </AvatarFallback>
      </Comp>
    );
  }
);

export default UserAvatar;

UserAvatar.displayName = 'UserAvatar';
