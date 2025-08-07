import { SessionProvider } from 'next-auth/react';
import NavBar from '@/components/layout/nav-bar';
import AuthRedirectClient from '@/components/shared/auth-redirect-client';
import NotificationsStoreInitializer from '@/features/notifications/components/store/store-initializer';
import UserProfileStoreInitializer from '@/features/users/components/store/store-initializer';
import { auth } from '@/lib/auth/auth';

async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session || !session.user)
    return <AuthRedirectClient />;

  return (
    <div className="max-w-screen-xl mx-auto min-h-screen grid grid-rows-[auto_1fr]">
      <header>
        <UserProfileStoreInitializer />
        <SessionProvider>
          <NotificationsStoreInitializer />
        </SessionProvider>
        <NavBar />
      </header>
      <main className="p-10 max-w-screen-xl">{children}</main>
    </div>
  );
}

export default AuthLayout;
