import React from 'react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { auth } from '@/lib/auth/auth';
import UserAvatar from '@/components/nav-bar/user-avatar';
import CloudinaryUploadButton from '@/components/shared/cloudinary-upload-button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserRound } from 'lucide-react';
import { AvatarImage } from '@/components/ui/avatar';

const UserProfilePage = async () => {
  const session = await auth();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        {session?.user?.image && (
          <>
            <UserAvatar
              user={session!.user!}
              className="h-32 w-32 rounded-full"
            />
            <CloudinaryUploadButton />
          </>
        )}
        <CardDescription>
          {session?.user?.name} - {session?.user?.email}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Avatar className="h-32 w-32">
          <AvatarImage src={session?.user?.image!} alt={session?.user?.name!} />
          <AvatarFallback>
            <UserRound />
          </AvatarFallback>
        </Avatar>
      </CardContent>
    </Card>
  );
};

export default UserProfilePage;
