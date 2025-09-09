'use client';

import { intervalToDuration } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { useCountdown } from 'usehooks-ts';

export function useCooldown() {
  const [duration, setDuration] = useState(0);
  const [restartToken, setRestartToken] = useState(0);
  const [seconds, { startCountdown, resetCountdown, stopCountdown }] = useCountdown({
    countStart: duration,
    countStop: 0,
    intervalMs: 1000,
    isIncrement: false,
  });

  const start = useCallback((s: number) => {
    setDuration(s);
    setRestartToken(t => t + 1);
  }, []);

  useEffect(() => {
    if (duration > 0) {
      resetCountdown();
      startCountdown();
    }
    else {
      stopCountdown();
    }
  }, [restartToken, duration, resetCountdown, startCountdown, stopCountdown]);

  useEffect(() => {
    return () => {
      stopCountdown();
    };
  }, [stopCountdown]);

  return { seconds, start, formatted: formatCooldown(seconds) };
}

function formatCooldown(seconds: number) {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 });

  const parts = [
    duration.hours ? `${duration.hours}h` : null,
    duration.minutes ? `${duration.minutes}m` : null,
    duration.seconds ? `${duration.seconds}s` : null,
  ].filter(Boolean);

  return parts.join(' ');
}
