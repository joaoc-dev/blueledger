import NavBar from '@/components/layout/nav-bar';
import AuthRedirectClient from '@/components/shared/auth-redirect-client';
import { auth } from '@/lib/auth/auth';
import UserProfileStoreInitializer from '@/features/users/components/store/store-initializer';
import NotificationsStoreInitializer from '@/features/notifications/components/store/store-initializer';
import { SkeletonTheme } from 'react-loading-skeleton';
import { SessionProvider } from 'next-auth/react';

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session || !session.user) return <AuthRedirectClient />;

  return (
    <SkeletonTheme
      baseColor="var(--color-muted)"
      highlightColor="var(--color-card)"
      duration={1.5}
    >
      <div className="max-w-screen-xl mx-auto min-h-screen grid grid-rows-[auto_1fr] ">
        <header className="mb-8">
          <UserProfileStoreInitializer />
          <SessionProvider>
            <NotificationsStoreInitializer />
          </SessionProvider>
          <NavBar />
        </header>
        <main className="p-10">{children}</main>
      </div>
    </SkeletonTheme>
  );
};

export default AuthLayout;
