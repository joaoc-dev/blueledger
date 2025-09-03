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

class RequestLogger {
  private logger: Logger;
  private requestId: string;
  private startTime: number;

  constructor(source: string, request?: NextAuthRequest | NextRequest) {
    this.logger = new Logger({
      source: `${APP_NAME}:${source}`,
    });

    this.requestId = this.generateRequestId(request);
    this.startTime = Date.now();

    const userId = request ? (request as NextAuthRequest).auth?.user?.id ?? null : null;
    const requestLogData: RequestLogData = {
      requestId: this.requestId,
      method: request?.method ?? 'UNKNOWN',
      path: request?.nextUrl?.pathname ?? 'UNKNOWN',
    };

    if (userId) {
      requestLogData.userId = userId;
    }

    this.logger.info(LogEvents.REQUEST_RECEIVED, requestLogData);
  }

  private generateRequestId(request?: NextAuthRequest | NextRequest) {
    if (!request) {
      // Fallback if request is undefined
      return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
    }

    const headers = request.headers;
    if (!headers || typeof headers.get !== 'function') {
      return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
    }

    return headers.get('x-request-id')
      ?? globalThis.crypto?.randomUUID?.()
      ?? `${Date.now()}-${Math.random()}`;
  }

  info(event: string, data?: Record<string, any>) {
    this.logger.info(event, {
      ...data,
      requestId: this.requestId,
      durationMs: Date.now() - this.startTime,
    });
  }

  warn(event: string, data?: Record<string, any>) {
    this.logger.warn(event, {
      ...data,
      requestId: this.requestId,
      durationMs: Date.now() - this.startTime,
    });
  }

  error(event: string, data?: Record<string, any>) {
    this.logger.error(event, {
      ...data,
      requestId: this.requestId,
      durationMs: Date.now() - this.startTime,
    });
  }

  async flush() {
    await this.logger.flush();
  }
}

export function createLogger(source: string, request?: NextAuthRequest | NextRequest) {
  return new RequestLogger(source, request);
}
