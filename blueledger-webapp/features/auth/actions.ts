'use server';

import { signIn } from '@/lib/auth/auth';

export async function signInGithub(callbackUrl?: string) {
  await signIn('github', callbackUrl ? { redirectTo: callbackUrl } : undefined);
}
