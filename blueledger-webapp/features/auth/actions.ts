'use server';

import { signIn } from '@/lib/auth/auth';

export async function signInGithub(callbackUrl?: string) {
  const redirectTo = callbackUrl?.startsWith('/') && !callbackUrl.startsWith('//')
    ? callbackUrl
    : undefined;
  await signIn('github', redirectTo ? { redirectTo } : undefined);
}
