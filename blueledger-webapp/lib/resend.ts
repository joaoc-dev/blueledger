import { createElement } from 'react';
import { Resend } from 'resend';
import PasswordResetEmail from '@/emails/password-reset-email';
import WelcomeEmail from '@/emails/welcome-email';
import { env as clientEnv } from '@/env/client';
import { env } from '@/env/server';

const resend = new Resend(env.RESEND_API_KEY);

export async function sendVerificationCodeEmail(to: string, code: string) {
  const { data, error } = await resend.emails.send({
    from: env.AUTH_EMAIL_VERIFICATION_FROM,
    to,
    subject: 'Welcome to Blue Ledger',
    react: createElement(WelcomeEmail, { code, logoSrc: clientEnv.NEXT_PUBLIC_SITE_URL }),
  });
  if (error) {
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
  if (!data?.id) {
    throw new Error('Resend did not return an email id');
  }
  return data.id;
}

export async function sendPasswordResetCodeEmail(to: string, code: string) {
  const { data, error } = await resend.emails.send({
    from: env.AUTH_EMAIL_PASSWORD_RESET_FROM,
    to,
    subject: 'Reset password code',
    react: createElement(PasswordResetEmail, { code, logoSrc: clientEnv.NEXT_PUBLIC_SITE_URL }),
  });
  if (error) {
    throw new Error(`Failed to send password reset email: ${error.message}`);
  }
  if (!data?.id) {
    throw new Error('Resend did not return an email id');
  }
  return data.id;
}
