// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import * as Spotlight from '@spotlightjs/spotlight';
import posthog from 'posthog-js';
import { env } from './env/client';

posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: '/relay-bMCm',
  ui_host: 'https://eu.posthog.com',
  defaults: '2025-05-24',
});

Sentry.init({
  dsn: 'https://9c305a5d5f5e3836318633069eb728c9@o4509446917914624.ingest.de.sentry.io/4509446919487568',

  // Add optional integrations for additional features
  integrations: [
    Sentry.replayIntegration(),
  ],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});

if (process.env.NODE_ENV === 'development') {
  Spotlight.init();
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
