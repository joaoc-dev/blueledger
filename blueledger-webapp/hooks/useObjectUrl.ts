import { useEffect, useReducer, useRef } from 'react';

interface UseObjectUrlOptions {
  /**
   * When true, the object URL is only exposed after the underlying image finishes loading.
   * This avoids flicker and partially rendered images. Defaults to true.
   */
  preload?: boolean;
}

/**
 * Creates and manages a lifetime-safe `blob:` object URL for a given `Blob`.
 * - Generates a new URL whenever the input blob changes
 * - Optionally preloads the image and only exposes the URL after it loads
 * - Revokes previously created URLs to prevent memory leaks
 *
 * Note: If the `blob` becomes `null`/`undefined`, the last valid URL is kept
 * to mirror common preview UX. Unmounting will always revoke the current URL.
 */
export function useObjectUrl(
  blob: Blob | null | undefined,
  options?: UseObjectUrlOptions,
): string | undefined {
  const { preload = true } = options ?? {};

  const [displayUrl, dispatchDisplayUrl] = useReducer(
    (_current: string | undefined, next: string | undefined) => next,
    undefined as string | undefined,
  );
  const prevDisplayUrlRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!blob)
      return;

    const candidateUrl = URL.createObjectURL(blob);
    let canceled = false;

    if (preload) {
      const img = new window.Image();
      img.decoding = 'async';
      img.loading = 'eager';

      img.onload = () => {
        if (canceled) {
          URL.revokeObjectURL(candidateUrl);
          return;
        }
        const oldUrl = prevDisplayUrlRef.current;
        dispatchDisplayUrl(candidateUrl);
        if (oldUrl)
          URL.revokeObjectURL(oldUrl);
        prevDisplayUrlRef.current = candidateUrl;
      };

      img.src = candidateUrl;
    }
    else {
      const oldUrl = prevDisplayUrlRef.current;
      dispatchDisplayUrl(candidateUrl);
      if (oldUrl)
        URL.revokeObjectURL(oldUrl);
      prevDisplayUrlRef.current = candidateUrl;
    }

    return () => {
      canceled = true;
      if (prevDisplayUrlRef.current !== candidateUrl)
        URL.revokeObjectURL(candidateUrl);
    };
  }, [blob, preload]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (prevDisplayUrlRef.current)
        URL.revokeObjectURL(prevDisplayUrlRef.current);
    };
  }, []);

  return displayUrl;
}
