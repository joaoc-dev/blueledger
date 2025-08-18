import { useCallback } from 'react';
import { useBoolean } from 'usehooks-ts';
import { confirmPasswordReset } from '../password-reset-client';

export function useConfirmPasswordReset() {
  const { value: isSubmitting, setTrue, setFalse } = useBoolean(false);

  const confirm = useCallback(async (params: { email: string; code: string; newPassword: string }) => {
    setTrue();

    const result = await confirmPasswordReset(params);

    setFalse();
    return result;
  }, [setTrue, setFalse]);

  return { isSubmitting, confirm };
}
