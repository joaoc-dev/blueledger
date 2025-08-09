'use server';

import { signIn } from './auth';

export async function signInGithub(callbackUrl?: string) {
  await signIn('github', callbackUrl ? { redirectTo: callbackUrl } : undefined);
}
