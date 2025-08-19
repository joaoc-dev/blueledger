import type { NextAuthRequest } from 'next-auth';
import type { NextRequest } from 'next/server';
import { Logger } from 'next-axiom';
import { LogEvents } from '@/constants/log-events';

const APP_NAME = 'blueledger';

interface RequestLogData {
  requestId: string;
  method: string;
  path: string;
  userId?: string;
}

export function createLogger(source: string) {
  return new Logger({
    source: `${APP_NAME}:${source}`,
  });
}

export function logRequest(logger: Logger, request: NextAuthRequest | NextRequest) {
  const requestId = generateRequestId(request);
  const userId = (request as NextAuthRequest).auth?.user?.id ?? null;

  const requestLogData: RequestLogData = {
    requestId,
    method: request.method,
    path: request.nextUrl.pathname,
  };

  if (userId) {
    requestLogData.userId = userId;
  }

  logger.info(LogEvents.REQUEST_RECEIVED, requestLogData);

  return { requestId };
}

export function generateRequestId(request: NextAuthRequest | NextRequest) {
  return request.headers.get('x-request-id')
    ?? globalThis.crypto?.randomUUID?.()
    ?? `${Date.now()}-${Math.random()}`;
}
