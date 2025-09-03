import type { RequestPasswordResetResult } from '../client';
import { useCallback } from 'react';
import { useBoolean } from 'usehooks-ts';
import { requestPasswordReset } from '../client';

export function useRequestPasswordResetCode() {
  const { value: isSending, setTrue, setFalse } = useBoolean(false);

  const send = useCallback(async (email: string): Promise<RequestPasswordResetResult> => {
    setTrue();

    const result = await requestPasswordReset(email);

    setFalse();
    return result;
  }, [setTrue, setFalse]);

  return { isSending, send };
}
