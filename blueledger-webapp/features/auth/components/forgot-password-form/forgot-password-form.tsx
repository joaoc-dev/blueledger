'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import ResetEmailForm from './reset-email-form';
import ResetPasswordForm from './reset-password-form';

function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<'request' | 'confirm'>('request');
  const [email, setEmail] = useState<string>();

  const onCodeSent = (e: string) => {
    setEmail(e);
    setStep('confirm');
  };

  const onSuccess = () => {
    router.replace('/dashboard');
  };

  const codeSent = step === 'confirm';

  return (
    <Card className="max-w-[360px] rounded-lg mx-auto">
      <CardHeader className="flex flex-col gap-6 items-center text-center">
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription className="w-full text-balance truncate">
          {codeSent
            ? 'To continue, please enter the 6 digit verification code sent to your email address.'
            : (
                <>
                  <p>Please enter your email address. </p>
                  <p>You will receive a 6 digit verification code to reset your password.</p>
                </>
              )}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {codeSent
          ? <ResetPasswordForm email={email!} onSuccess={onSuccess} />
          : <ResetEmailForm onCodeSent={onCodeSent} />}
      </CardContent>

      <CardFooter className="flex justify-center">
        <Button asChild variant="link" className="text-xs underline">
          <Link href="/auth/signin">Back to Login</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ForgotPasswordForm;
