import { useCallback } from 'react';
import { useBoolean } from 'usehooks-ts';
import { requestPasswordReset } from '../password-reset-client';

export function useRequestPasswordResetCode() {
  const { value: isSending, setTrue, setFalse } = useBoolean(false);

  const send = useCallback(async (email: string) => {
    setTrue();

    const result = await requestPasswordReset(email);

    setFalse();
    return result;
  }, [setTrue, setFalse]);

  return { isSending, send };
}
