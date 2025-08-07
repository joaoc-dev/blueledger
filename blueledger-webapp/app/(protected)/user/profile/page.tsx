import { SessionProvider } from 'next-auth/react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { UserAvatarEdit, UserProfileForm } from '@/features/users/components';

async function UserProfilePage() {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col md:flex-row gap-10 min-h-[250px]">
        <div className="mx-auto">
          <SessionProvider>
            <UserAvatarEdit />
          </SessionProvider>
        </div>

        <div className="hidden md:block mx-auto">
          <Separator orientation="vertical" />
        </div>
        <SessionProvider>
          <UserProfileForm />
        </SessionProvider>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}

export default UserProfilePage;
