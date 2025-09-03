import type { NextAuthRequest } from 'next-auth';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import { auth } from '@/lib/auth/auth';
import { createLogger } from '@/lib/logger';

type Handler<P = undefined> = (
  request: NextAuthRequest,
  context: P extends undefined ? Record<string, never> : { params: P }
) => Promise<NextResponse>;

export function withAuth<P = undefined>(handler: Handler<P>) {
  return auth(async (request: NextAuthRequest, context) => {
    if (!request.auth || !request.auth.user) {
      const logger = createLogger('api/auth', request);

      logger.warn(LogEvents.UNAUTHORIZED_REQUEST, {
        userAgent: request.headers.get('user-agent') ?? undefined,
      });

      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return handler(
      request,
      context as P extends undefined ? Record<string, never> : { params: P },
    );
  });
}
