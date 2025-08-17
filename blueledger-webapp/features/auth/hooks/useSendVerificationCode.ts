import type { SendVerificationCodeResult } from '../client';
import { useCallback } from 'react';
import { useBoolean } from 'usehooks-ts';
import { sendVerificationCode } from '../client';

export function useSendVerificationCode() {
  const { value: isSending, setTrue, setFalse } = useBoolean(false);

  const send = useCallback(async (): Promise<SendVerificationCodeResult> => {
    setTrue();

    const result = await sendVerificationCode();

    setFalse();
    return result;
  }, [setTrue, setFalse]);

  return { isSending, send };
}
