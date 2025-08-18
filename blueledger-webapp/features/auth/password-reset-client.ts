import type { ApiError } from '@/lib/api-client';
import { apiPost } from '@/lib/api-client';

export type RequestPasswordResetResult
  = | { success: true }
    | { success: false; error: string; retryAfter?: number; status?: number };

export async function requestPasswordReset(email: string): Promise<RequestPasswordResetResult> {
  try {
    await apiPost('/auth/password-reset/request', { email });
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

export type ConfirmPasswordResetResult
  = | { success: true }
    | { success: false; error: string; retryAfter?: number; status?: number };

export async function confirmPasswordReset(params: { email: string; code: string; newPassword: string }): Promise<ConfirmPasswordResetResult> {
  try {
    await apiPost('/auth/password-reset/confirm', params);
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
