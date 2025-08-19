import { useIsClient, useMediaQuery } from 'usehooks-ts';

export function useIsMobile(breakpoint = 768) {
  const isClient = useIsClient();
  const matches = useMediaQuery(`(max-width: ${breakpoint}px)`);
  return isClient ? matches : undefined;
}
