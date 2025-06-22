import React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { auth } from '@/lib/auth/auth';
import { UserAvatarEdit } from '@/components/nav-bar/user-avatar-edit';
import UserProfileForm from '@/components/users/user-profile-form';
import { Separator } from '@/components/ui/separator';
import { SessionProvider } from 'next-auth/react';

const UserProfilePage = async () => {
  const session = await auth();

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col md:flex-row gap-10 min-h-[250px]">
        <div className="mx-auto">
          <UserAvatarEdit user={session!.user!} />
        </div>

        <div className="hidden md:block mx-auto">
          <Separator orientation="vertical" />
        </div>
        <SessionProvider>
          <UserProfileForm user={session!.user!} />
        </SessionProvider>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default UserProfilePage;
