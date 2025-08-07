import { Logger } from 'next-axiom';

const APP_NAME = 'blueledger';

export function createLogger(source: string) {
  return new Logger({
    source: `${APP_NAME}:${source}`,
  });
}
