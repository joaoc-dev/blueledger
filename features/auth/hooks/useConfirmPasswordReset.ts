import type { ConfirmPasswordResetResult } from '../client';
import { useCallback } from 'react';
import { useBoolean } from 'usehooks-ts';
import { confirmPasswordReset } from '../client';

export function useConfirmPasswordReset() {
  const { value: isSubmitting, setTrue, setFalse } = useBoolean(false);

  const confirm = useCallback(async (params: {
    email: string;
    code: string;
    newPassword: string;
  }): Promise<ConfirmPasswordResetResult> => {
    setTrue();

    const result = await confirmPasswordReset(params);

    setFalse();
    return result;
  }, [setTrue, setFalse]);

  return { isSubmitting, confirm };
}
