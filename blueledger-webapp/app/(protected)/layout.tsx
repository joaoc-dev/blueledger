import { SessionProvider } from 'next-auth/react';
import NavBar from '@/components/layout/nav-bar';
import AuthRedirectClient from '@/components/shared/auth-redirect-client';
import { LogEvents } from '@/constants/log-events';
import NotificationsStoreInitializer from '@/features/notifications/components/store/store-initializer';
import UserProfileStoreInitializer from '@/features/users/components/store/store-initializer';
import { auth } from '@/lib/auth/auth';
import { createLogger } from '@/lib/logger';

async function AuthLayout({ children }: { children: React.ReactNode }) {
  const logger = createLogger('app/protected/layout');
  const session = await auth();

  if (!session || !session.user) {
    logger.warn(LogEvents.UNAUTHORIZED_PAGE_ACCESS, {
      path: '/',
      status: 302,
    });
    return <AuthRedirectClient />;
  }

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
