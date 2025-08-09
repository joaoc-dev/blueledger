import { SessionProvider } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { LogEvents } from '@/constants/log-events';
import { auth } from '@/lib/auth/auth';
import { createLogger } from '@/lib/logger';

async function AuthLayout({ children }: { children: React.ReactNode }) {
  const logger = createLogger('app/auth/layout');
  const session = await auth();

  if (session && session.user) {
    logger.warn(LogEvents.ALREADY_AUTHENTICATED, {
      path: '/',
      status: 302,
      user: session.user.id,
    });
    redirect('/dashboard');
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <SessionProvider>
        {children}
      </SessionProvider>
    </main>
  );
}

export default AuthLayout;
