import { createElement } from 'react';
import { Resend } from 'resend';
import PasswordResetEmail from '@/emails/password-reset-email';
import WelcomeEmail from '@/emails/welcome-email';
import { env } from '@/env/server';

const resend = new Resend(env.RESEND_API_KEY);

export async function sendVerificationCodeEmail(to: string, code: string) {
  await resend.emails.send({
    from: env.AUTH_EMAIL_VERIFICATION_FROM,
    to,
    subject: 'Welcome to Blue Ledger',
    react: createElement(WelcomeEmail, { code }),
  });
}

export async function sendPasswordResetCodeEmail(to: string, code: string) {
  await resend.emails.send({
    from: env.AUTH_EMAIL_PASSWORD_RESET_FROM,
    to,
    subject: 'Reset password code',
    react: createElement(PasswordResetEmail, { code }),
  });
}
