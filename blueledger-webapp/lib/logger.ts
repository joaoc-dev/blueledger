import type { NextAuthRequest } from 'next-auth';
import { Logger } from 'next-axiom';
import { LogEvents } from '@/constants/log-events';

const APP_NAME = 'blueledger';

export function createLogger(source: string) {
  return new Logger({
    source: `${APP_NAME}:${source}`,
  });
}

export function logRequest(logger: Logger, request: NextAuthRequest) {
  const requestId = generateRequestId(request);

  logger.info(LogEvents.REQUEST_RECEIVED, {
    requestId,
    method: request.method,
    path: request.nextUrl.pathname,
    userId: request.auth?.user?.id ?? null,
  });

  return { requestId };
}

export function generateRequestId(request: NextAuthRequest) {
  return request.headers.get('x-request-id') ?? globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}
