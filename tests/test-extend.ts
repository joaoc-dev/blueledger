import type { SetupWorker } from 'msw/browser';
import { test as testBase } from 'vitest';
import { startWorker, worker } from './mocks/browser.js';

export const test = testBase.extend<{ worker: SetupWorker }>({
  worker: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use) => {
      // Start the worker before the test.
      await startWorker();

      // Expose the worker object on the test's context.
      await use(worker);

      // Remove any request handlers added in individual test cases.
      // This prevents them from affecting unrelated tests.
      worker.resetHandlers();
    },
    { auto: true },
  ],
});
