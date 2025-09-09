import type { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import posthog from 'posthog-js';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { AnalyticsEvents } from '@/constants/analytics-events';
import { useCooldown } from '@/hooks/useCooldown';
import { VERIFICATION_CODE_LENGTH } from '../../constants';
import { useConfirmPasswordReset } from '../../hooks/useConfirmPasswordReset';
import { passwordResetFormSchema } from '../../schemas';

type FormData = z.infer<typeof passwordResetFormSchema>;

interface ResetPasswordFormProps {
  email: string;
  onSuccess: () => void;
}

function ResetPasswordForm({ email, onSuccess }: ResetPasswordFormProps) {
  const [codeValue, setCodeValue] = useState('');
  const [errorText, setErrorText] = useState<string | null>(null);
  const { isSubmitting, confirm } = useConfirmPasswordReset();
  const cooldownTimer = useCooldown();

  const form = useForm<FormData>({
    resolver: zodResolver(passwordResetFormSchema),
    defaultValues: { email, code: '', newPassword: '', confirmPassword: '' },
  });

  const otpSlots = Array.from({ length: VERIFICATION_CODE_LENGTH }, (_, i) => ({
    stableKey: `empty-${i}`,
    id: i,
  }));

  const onSubmit = async (data: FormData) => {
    const toastId = uuidv4();
    toast.loading('Resetting password…', { id: toastId });
    posthog.capture(AnalyticsEvents.PASSWORD_RESET_CONFIRM_SUBMIT);
    const res = await confirm({ email: data.email, code: data.code, newPassword: data.newPassword });
    const cooldownTime = res?.success
      ? 0
      : res?.retryAfter ?? 0;

    cooldownTimer.start(cooldownTime);
    if (res.success) {
      toast.success('Password reset. You can now sign in.', { id: toastId });
      posthog.capture(AnalyticsEvents.PASSWORD_RESET_CONFIRM_SUCCESS);
      onSuccess();
    }
    else {
      if (res.status && res.status >= 500)
        toast.error('Something went wrong. Please try again in a moment.', { id: toastId });
      else
        toast.error('Invalid or expired code', { id: toastId });
      posthog.capture(AnalyticsEvents.PASSWORD_RESET_CONFIRM_ERROR, { status: res.status });
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification code</FormLabel>
              <FormControl>
                <InputOTP
                  autoFocus
                  maxLength={VERIFICATION_CODE_LENGTH}
                  value={codeValue}
                  onChange={(val) => {
                    field.onChange(val.replace(/\D/g, ''));
                    if (errorText)
                      setErrorText(null);
                    setCodeValue(val.replace(/\D/g, ''));
                  }}
                  onComplete={() => {}}
                  aria-invalid={!!errorText}
                >
                  <InputOTPGroup className="flex w-full gap-1 mb-4">
                    {otpSlots.map(slot => (
                      <InputOTPSlot key={slot.stableKey} index={slot.id} className="flex-1 aspect-square h-full border-l" />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} type="password" placeholder="Password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} type="password" placeholder="Confirm password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting || cooldownTimer.seconds > 0} className="w-full">
          {cooldownTimer.seconds > 0
            ? `Retry in ${cooldownTimer.formatted}`
            : isSubmitting ? 'Submitting…' : 'Submit'}
        </Button>
      </form>
    </Form>
  );
}

export default ResetPasswordForm;
