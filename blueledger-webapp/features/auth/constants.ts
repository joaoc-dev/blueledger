export const VERIFICATION_CODE_LENGTH = 6;
export const VERIFICATION_CODE_TTL_MS = 60 * 60 * 1000; // 60m

export const SEND_LIMIT_SHORT = { max: 1, windowSec: 60 };
export const SEND_LIMIT_DAILY = { max: 20, windowSec: 86400 };
