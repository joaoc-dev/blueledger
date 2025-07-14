import NavBar from '@/components/nav-bar';
import AuthRedirectClient from '@/components/shared/auth-redirect-client';
import { auth } from '@/lib/auth/auth';
import UserProfileStoreInitializer from '@/components/shared/user-profile-store-initializer';
import NotificationsStoreInitializer from '@/components/shared/notifications-store-initializer';
import { SkeletonTheme } from 'react-loading-skeleton';

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
        <header className="mb-20">
          <UserProfileStoreInitializer />
          <NotificationsStoreInitializer />
          <NavBar />
        </header>
        <main className="p-10">{children}</main>
      </div>
    </SkeletonTheme>
  );
};

export default AuthLayout;
