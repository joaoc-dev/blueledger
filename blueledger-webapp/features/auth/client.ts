import type { ApiError } from '@/lib/api-client';
import { apiPost } from '@/lib/api-client';

const endpointBase = '/auth/verification-code';

export type SendVerificationCodeResult
  = | { success: true }
    | { success: false; error: string; retryAfter?: number; status?: number };

export async function sendVerificationCode(): Promise<SendVerificationCodeResult> {
  try {
    await apiPost(`${endpointBase}/send`);
    return { success: true };
  }
  catch (e) {
    const err = e as ApiError<{ error?: string; retryAfter?: number }>;
    return {
      success: false,
      error: err.message,
      retryAfter: err.retryAfter,
      status: err.status,
    };
  }
}

export type ConfirmVerificationCodeResult
  = | { success: true }
    | { success: false; error: string; retryAfter?: number; status?: number };

export async function confirmVerificationCode(code: string): Promise<ConfirmVerificationCodeResult> {
  try {
    await apiPost(`${endpointBase}/confirm`, { code });
    return { success: true };
  }
  catch (e) {
    const err = e as ApiError<{ error?: string }>;
    return {
      success: false,
      error: err.message,
      retryAfter: err.retryAfter,
      status: err.status,
    };
  }
}
