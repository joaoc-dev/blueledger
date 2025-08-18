'use client';

import { Mail } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { validateRequest } from '@/app/api/validateRequest';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Separator } from '@/components/ui/separator';
import { useCooldown } from '@/hooks/useCooldown';
import { SEND_LIMIT_SHORT, VERIFICATION_CODE_LENGTH } from '../constants';
import { useConfirmVerificationCode } from '../hooks/useConfirmVerificationCode';
import { useSendVerificationCode } from '../hooks/useSendVerificationCode';
import { validationCodeSchema } from '../schemas';

function VerifyEmailForm() {
  const router = useRouter();
  const { data, update } = useSession();
  const email = data?.user?.email ?? '';

  const sendHook = useSendVerificationCode();
  const confirmCodeHook = useConfirmVerificationCode();
  const sendCooldownTimer = useCooldown();
  const confirmCooldownTimer = useCooldown();

  const [errorText, setErrorText] = useState<string | null>(null);
  const [code, setCode] = useState('');

  async function sendCode() {
    const res = await sendHook.send();

    const cooldownTime = (res && !res.success ? res.retryAfter : undefined)
      ?? SEND_LIMIT_SHORT.windowSec;

    sendCooldownTimer.start(cooldownTime);

    if (res && !res.success) {
      if (res.retryAfter)
        toast.error(`Please wait before requesting another code. (${res.retryAfter}s)`);
      else
        toast.error('Something went wrong. Please try again in a moment.');
      return;
    }

    toast.success('Verification code sent');
  }

  async function submitCode() {
    try {
      if (confirmCooldownTimer.seconds > 0)
        return;

      const validationResult = validateRequest(validationCodeSchema, code);
      if (!validationResult.success) {
        setErrorText('Please enter a valid code');
        return;
      }

      const res = await confirmCodeHook.confirm(validationResult.data);
      const cooldownTime = res?.success
        ? 0
        : res?.retryAfter ?? 0;

      confirmCooldownTimer.start(cooldownTime);

      if (res.success) {
        // Call update with an empty object otherwise trigger will be undefined
        await update({});

        toast.success('Email verified');
        router.replace('/dashboard');
      }
      else {
        if (res.status && res.status >= 500)
          toast.error('Something went wrong. Please try again in a moment.');
        else
          setErrorText('Invalid or expired code');
      }
    }
    catch {
      toast.error('Something went wrong. Please try again in a moment.');
    }
  }

  const otpSlots = Array.from({ length: VERIFICATION_CODE_LENGTH }, (_, i) => ({
    stableKey: `empty-${i}`,
    id: i,
  }));

  return (
    <Card className="max-w-[420px] rounded-lg mx-auto">

      <CardHeader className="flex flex-col gap-6 items-center text-center">
        <Mail className="w-10 h-10" />
        <CardTitle>Verify your email</CardTitle>
        <CardDescription className="w-full text-balance truncate">
          {`We sent an email with a 6-digit code to ${email}, enter it below:`}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <InputOTP
          autoFocus
          maxLength={VERIFICATION_CODE_LENGTH}
          value={code}
          onChange={(val) => {
            if (errorText)
              setErrorText(null);
            setCode(val.replace(/\D/g, ''));
          }}
          onComplete={submitCode}
          aria-invalid={!!errorText}

        >
          <InputOTPGroup className="flex w-full gap-1">
            {otpSlots.map(slot => (
              <InputOTPSlot
                key={slot.stableKey}
                index={slot.id}
                className="flex-1 aspect-square h-full border-l"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>

        { /* Error message */ }
        {errorText && (
          <p className="text-sm text-red-600" role="alert">{errorText}</p>
        )}

        { /* Buttons */ }
        <div className="flex flex-col gap-2">
          { /* Verify email button */ }
          <Button
            onClick={submitCode}
            disabled={confirmCodeHook.isSubmitting || confirmCooldownTimer.seconds > 0}
          >
            {confirmCooldownTimer.seconds > 0
              ? `Retry verification in ${confirmCooldownTimer.formatted}`
              : confirmCodeHook.isSubmitting ? 'Verifying…' : 'Verify email'}
          </Button>

          { /* Resend code button */ }
          <Button
            variant="secondary"
            onClick={sendCode}
            disabled={sendHook.isSending || sendCooldownTimer.seconds > 0}
          >
            {sendCooldownTimer.seconds > 0
              ? `Resend in ${sendCooldownTimer.formatted}`
              : sendHook.isSending ? 'Sending…' : 'Resend code'}
          </Button>
        </div>

        <Separator />

      </CardContent>

      <CardFooter className="flex justify-center">
        <div className="text-xs text-muted-foreground text-center">
          Wrong account?
          {' '}
          <Button variant="link" className="px-1" onClick={() => signOut({ callbackUrl: '/' })}>
            Sign out
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default VerifyEmailForm;
