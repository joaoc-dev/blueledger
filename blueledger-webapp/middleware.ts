import type { NextFetchEvent, NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createLogger } from './lib/logger';

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  const logger = createLogger('middleware');

  // Log all requests automatically
  logger.middleware(request);

  // Flush logs before response
  event.waitUntil(logger.flush());

  return NextResponse.next();
}
