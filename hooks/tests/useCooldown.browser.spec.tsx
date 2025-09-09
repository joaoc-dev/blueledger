import { useEffect } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-react';
import { useCooldown } from '../useCooldown';

function TestComponent({ autoStart }: { autoStart?: number }) {
  const { seconds, start, formatted } = useCooldown();

  useEffect(() => {
    if (autoStart !== undefined) {
      start(autoStart);
    }
  }, [autoStart, start]);

  return (
    <div>
      <div data-testid="seconds">{seconds}</div>
      <div data-testid="formatted">{formatted}</div>
      <button type="button" data-testid="start-30" onClick={() => start(30)}>Start 30s</button>
    </div>
  );
}

describe('useCooldown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  describe('initial state', () => {
    it('should start with 0 seconds and empty formatted time', async () => {
      const { getByTestId } = render(<TestComponent />);

      await expect.element(getByTestId('seconds')).toHaveTextContent('0');
      await expect.element(getByTestId('formatted')).toHaveTextContent('');
    });
  });

  describe('starting countdown', () => {
    it('should start countdown when start() is called with positive number', async () => {
      const { getByTestId } = render(<TestComponent autoStart={30} />);

      await expect.element(getByTestId('seconds')).toHaveTextContent('30');
      await expect.element(getByTestId('formatted')).toHaveTextContent('30s');
    });

    it('should restart countdown with different duration', async () => {
      const { getByTestId, rerender } = render(<TestComponent autoStart={10} />);

      await expect.element(getByTestId('seconds')).toHaveTextContent('10');
      await expect.element(getByTestId('formatted')).toHaveTextContent('10s');

      // Restart with different duration
      rerender(<TestComponent autoStart={45} />);
      await expect.element(getByTestId('seconds')).toHaveTextContent('45');
      await expect.element(getByTestId('formatted')).toHaveTextContent('45s');
    });
  });

  describe('interactive Behavior', () => {
    it('responds to button clicks to start countdown', async () => {
      const { getByTestId } = render(<TestComponent />);

      // Initial state
      await expect.element(getByTestId('seconds')).toHaveTextContent('0');

      // Click to start 30 second countdown
      const startButton = getByTestId('start-30');
      await startButton.click();

      await expect.element(getByTestId('seconds')).toHaveTextContent('30');
      await expect.element(getByTestId('formatted')).toHaveTextContent('30s');
    });
  });

  describe('time Formatting', () => {
    it('should format seconds only', async () => {
      const { getByTestId } = render(<TestComponent autoStart={45} />);
      await expect.element(getByTestId('formatted')).toHaveTextContent('45s');
    });

    it('should format minutes and seconds', async () => {
      const { getByTestId } = render(<TestComponent autoStart={125} />);
      await expect.element(getByTestId('formatted')).toHaveTextContent('2m 5s');
    });

    it('should format hours, minutes, and seconds', async () => {
      const { getByTestId } = render(<TestComponent autoStart={3665} />);
      await expect.element(getByTestId('formatted')).toHaveTextContent('1h 1m 5s');
    });

    it('should format exactly 60 seconds as 1 minute', async () => {
      const { getByTestId } = render(<TestComponent autoStart={60} />);
      await expect.element(getByTestId('formatted')).toHaveTextContent('1m');
    });

    it('should format exactly 3600 seconds as 1 hour', async () => {
      const { getByTestId } = render(<TestComponent autoStart={3600} />);
      await expect.element(getByTestId('formatted')).toHaveTextContent('1h');
    });
  });

  describe('real countdown behavior', () => {
    it('should count down from 5 to 0 over time', async () => {
      const { getByTestId } = render(<TestComponent autoStart={5} />);

      // Initial state
      await expect.element(getByTestId('seconds')).toHaveTextContent('5');
      await expect.element(getByTestId('formatted')).toHaveTextContent('5s');

      // After 1 second
      vi.advanceTimersByTime(1000);
      await expect.element(getByTestId('seconds')).toHaveTextContent('4');
      await expect.element(getByTestId('formatted')).toHaveTextContent('4s');

      // After 1 more second (total 2 seconds)
      vi.advanceTimersByTime(1000);
      await expect.element(getByTestId('seconds')).toHaveTextContent('3');
      await expect.element(getByTestId('formatted')).toHaveTextContent('3s');

      // After 1 more second (total 3 seconds)
      vi.advanceTimersByTime(1000);
      await expect.element(getByTestId('seconds')).toHaveTextContent('2');
      await expect.element(getByTestId('formatted')).toHaveTextContent('2s');

      // After 1 more second (total 4 seconds)
      vi.advanceTimersByTime(1000);
      await expect.element(getByTestId('seconds')).toHaveTextContent('1');
      await expect.element(getByTestId('formatted')).toHaveTextContent('1s');

      // After 1 more second (total 5 seconds)
      vi.advanceTimersByTime(1000);
      await expect.element(getByTestId('seconds')).toHaveTextContent('0');
      await expect.element(getByTestId('formatted')).toHaveTextContent('');
    });
  });
});
