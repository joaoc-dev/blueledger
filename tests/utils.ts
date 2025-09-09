import type { SetupWorker } from 'msw/browser';
import { delay, http, HttpResponse } from 'msw';

export const HTTP_VERB = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

type HttpMethod = keyof typeof HTTP_VERB;

export function simulateDelay(worker: SetupWorker, method: HttpMethod, path: string, body: unknown, ms = 100) {
  worker.use(
    (http as any)[method.toLowerCase()](`/api${path}`, async () => {
      await delay(ms);
      return HttpResponse.json(body as any);
    }),
  );
}

export function simulateError(worker: SetupWorker, method: HttpMethod, path: string, status = 500) {
  worker.use(
    (http as any)[method.toLowerCase()](`${path}`, async () => {
      return HttpResponse.json({ error: 'error' }, { status });
    }),
  );
}
