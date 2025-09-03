import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { LogEvents } from '@/constants/log-events';
import SignInForm from '@/features/auth/components/signin-form';
import { auth } from '@/lib/auth/auth';
import { createLogger } from '@/lib/logger';
import { pageSeoConfigs } from '@/lib/seo';

export const metadata: Metadata = {
  title: pageSeoConfigs.signin.title,
  description: pageSeoConfigs.signin.description,
  robots: {
    index: false, // Auth pages should not be indexed
    follow: false,
  },
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const logger = createLogger('app/auth/signup');
  const session = await auth();

  if (session && session.user) {
    logger.warn(LogEvents.ALREADY_AUTHENTICATED, {
      path: '/',
      status: 302,
      user: session.user.id,
    });
    redirect('/dashboard');
  }

  let callbackUrl = (await searchParams).callbackUrl;
  callbackUrl = Array.isArray(callbackUrl) ? callbackUrl[0] : callbackUrl;

  if (!callbackUrl)
    callbackUrl = '/dashboard';

  return (
    <div className="w-full max-w-sm md:max-w-3xl">
      <SignInForm callbackUrl={callbackUrl} />
    </div>
  );
}
