import { http, HttpResponse } from 'msw';

export const errorHandlers = [
  http.get('/api/_error/:errorType', ({ params }) => {
    const errorType = String(params.errorType);

    switch (errorType) {
      case 'rate-limit':
        return HttpResponse.json(
          { error: 'Rate limited', retryAfter: 5 },
          { status: 429 },
        );
      case 'server-error':
        return HttpResponse.json(
          { error: 'Internal Server Error' },
          { status: 500 },
        );
      case 'not-found':
        return HttpResponse.json(
          { error: 'Resource not found' },
          { status: 404 },
        );
      case 'validation':
        return HttpResponse.json(
          { error: 'Validation failed', details: ['Invalid input'] },
          { status: 400 },
        );
      default:
        return HttpResponse.json(
          { error: 'Unknown error type' },
          { status: 400 },
        );
    }
  }),
];
