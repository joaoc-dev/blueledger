import AuthRedirectClient from '@/components/shared/auth-redirect-client';
import { LogEvents } from '@/constants/log-events';
import { auth } from '@/lib/auth/auth';
import { createLogger } from '@/lib/logger';

export default async function VerifyEmailPage() {
  const logger = createLogger('app/auth/verify-email');
  const session = await auth();

  if (!session || !session.user) {
    logger.warn(LogEvents.UNAUTHORIZED_PAGE_ACCESS, {
      path: '/auth/verify-email',
      status: 302,
    });
    return <AuthRedirectClient />;
  }

  return (
    <div className="w-full max-w-sm md:max-w-3xl">
      Verify email
    </div>
  );
}
