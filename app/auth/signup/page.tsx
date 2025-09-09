import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { LogEvents } from '@/constants/log-events';
import SignUpForm from '@/features/auth/components/signup-form';
import { auth } from '@/lib/auth/auth';
import { createLogger } from '@/lib/logger';
import { pageSeoConfigs } from '@/lib/seo';

export const metadata: Metadata = {
  title: pageSeoConfigs.signup.title,
  description: pageSeoConfigs.signup.description,
  robots: {
    index: false, // Auth pages should not be indexed
    follow: false,
  },
};

async function SignUpPage() {
  const logger = createLogger('app/auth/signup');
  const session = await auth();

  if (session && session.user) {
    logger.warn(LogEvents.ALREADY_AUTHENTICATED, {
      path: '/auth/signup',
      status: 302,
      user: session.user.id,
    });

    if (session.user.emailVerified) {
      redirect('/dashboard');
    }

    redirect('/auth/verify-email');
  }

  return (
    <div className="w-full max-w-sm md:max-w-3xl">
      <SignUpForm />
    </div>
  );
}

export default SignUpPage;
