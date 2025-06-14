import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Slot } from '@radix-ui/react-slot';
import { UserRound } from 'lucide-react';
import { User } from 'next-auth';
import React from 'react';

type UserAvatarProps = {
  user: User;
  asChild?: boolean;
} & React.ComponentProps<typeof Avatar>;

const UserAvatar = React.forwardRef<HTMLDivElement, UserAvatarProps>(
  ({ user, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : Avatar;

    return (
      <Comp className="h-8 w-8 rounded-full" ref={ref} {...props}>
        <AvatarImage src={user.image!} alt={user.name!} />
        <AvatarFallback className="rounded-full">
          <UserRound />
        </AvatarFallback>
      </Comp>
    );
  }
);

export default UserAvatar;

UserAvatar.displayName = 'UserAvatar';
