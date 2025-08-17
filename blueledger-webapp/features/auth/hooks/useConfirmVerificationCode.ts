import { useCallback } from 'react';
import { useBoolean } from 'usehooks-ts';
import { confirmVerificationCode } from '../client';

export function useConfirmVerificationCode() {
  const { value: isSubmitting, setTrue, setFalse } = useBoolean(false);

  const confirm = useCallback(async (code: string) => {
    setTrue();

    const result = await confirmVerificationCode(code);

    setFalse();
    return result;
  }, [setTrue, setFalse]);

  return { isSubmitting, confirm };
}
