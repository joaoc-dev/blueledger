import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createLogger } from './lib/logger';

export async function middleware(request: NextRequest) {
  const logger = createLogger('middleware', request);

  logger.info('MIDDLEWARE_REQUEST', {
    method: request.method,
    path: request.nextUrl.pathname,
    userAgent: request.headers.get('user-agent') ?? undefined,
  });

  return NextResponse.next();
}
