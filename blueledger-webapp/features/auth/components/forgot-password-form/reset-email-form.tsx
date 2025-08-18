import type { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCooldown } from '@/hooks/useCooldown';
import { PASSWORD_RESET_REQUEST_LIMIT_SHORT } from '../../constants';
import { useRequestPasswordResetCode } from '../../hooks/useRequestPasswordResetCode';
import { emailPasswordResetSchema } from '../../schemas';

type FormData = z.infer<typeof emailPasswordResetSchema>;

interface ResetEmailFormProps {
  onCodeSent: (email: string) => void;
}

function ResetEmailForm({ onCodeSent }: ResetEmailFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(emailPasswordResetSchema),
    defaultValues: { email: '' },
  });

  const cooldownTimer = useCooldown();
  const { isSending, send } = useRequestPasswordResetCode();

  const onSubmit = async (data: FormData) => {
    if (cooldownTimer.seconds > 0)
      return;

    const res = await send(data.email);

    const cooldownTime = (res && !res.success ? res.retryAfter : undefined)
      ?? PASSWORD_RESET_REQUEST_LIMIT_SHORT.windowSec;

    cooldownTimer.start(cooldownTime);

    if (!res.success) {
      toast.error('Something went wrong. Please try again in a moment.');
      return;
    }

    toast.success('Reset code sent');
    onCodeSent(data.email);
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} type="email" placeholder="Email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting || isSending || cooldownTimer.seconds > 0}
          className="w-full"
        >
          {isSending
            ? (
                <>
                  <Loader2 className="animate-spin" />
                  {' '}
                  Sending…
                </>
              )
            : (
                cooldownTimer.seconds > 0 ? `Resend in ${cooldownTimer.formatted}` : 'Send code'
              )}
        </Button>
      </form>
    </Form>
  );
}

export default ResetEmailForm;
