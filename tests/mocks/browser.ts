import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

const worker = setupWorker(...handlers);
let _hasStarted = false;

async function startWorker() {
  if (_hasStarted)
    return;
  await worker.start();
  _hasStarted = true;
}

export { startWorker, worker };
