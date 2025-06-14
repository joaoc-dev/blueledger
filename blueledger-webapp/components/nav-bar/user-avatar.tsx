import { auth } from '@/lib/auth/auth';

export default async function UserAvatar() {
  const session = await auth();

  if (!session?.user) return null;

  return (
    <div>
      <p>{session.user.name}</p>
      {/* <Button onClick={() => signIn()}>Sign out</Button>
      <Button onClick={() => signOut()}>Sign out</Button> */}
    </div>
  );
}
