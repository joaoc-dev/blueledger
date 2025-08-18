export const VERIFICATION_CODE_LENGTH = 6;
export const VERIFICATION_CODE_TTL_MS = 60 * 60 * 1000; // 60m
export const PASSWORD_RESET_CODE_LENGTH = 6;
export const PASSWORD_RESET_CODE_TTL_MS = 30 * 60 * 1000; // 30m

export const SEND_LIMIT_SHORT = { max: 1, windowSec: 60 };
export const SEND_LIMIT_DAILY = { max: 20, windowSec: 86400 };

export const CONFIRM_ATTEMPTS_LIMIT_SHORT = { max: 5, windowSec: 60 };
export const CONFIRM_ATTEMPTS_LIMIT_DAILY = { max: 30, windowSec: 86400 };

export const PASSWORD_RESET_REQUEST_LIMIT_SHORT = { max: 1, windowSec: 60 };
export const PASSWORD_RESET_REQUEST_LIMIT_DAILY = { max: 10, windowSec: 86400 };
