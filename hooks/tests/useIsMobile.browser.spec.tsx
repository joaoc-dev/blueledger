import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { useIsMobile } from '../useIsMobile';

function TestComponent({ breakpoint = 768 }: { breakpoint?: number }) {
  const isMobile = useIsMobile(breakpoint);
  return <div data-testid="isMobile">{String(isMobile)}</div>;
}

describe('useIsMobile', () => {
  it('should render', async () => {
    expect(() => {
      render(<TestComponent />);
    }).not.toThrow();
  });

  it('should accept custom breakpoints', async () => {
    expect(() => {
      render(<TestComponent breakpoint={1024} />);
    }).not.toThrow();
  });
});
