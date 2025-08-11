import { useIsMounted, useMediaQuery } from 'usehooks-ts';

export function useIsMobile(breakpoint = 768) {
  const isMounted = useIsMounted();
  const matches = useMediaQuery(`(max-width: ${breakpoint}px)`);
  return isMounted() ? matches : undefined;
}
