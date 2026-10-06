import { useEffect, useState } from 'react';

/** Modified clicks and new tabs are the user asking for a second window, not for leaving. */
const opensElsewhere = (event: MouseEvent) =>
  event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

const here = () => window.location.pathname + window.location.search;

/**
 * Holds back a departure while there is unsaved work.
 *
 * An in-app link is caught before the router sees it and handed back as `pending`, for the
 * caller to confirm and then navigate. A reload or a closed tab gets the browser's own prompt,
 * whose wording is not ours to set. Back and forward cannot be caught at all: blocking those
 * needs a data router, and this app mounts a plain `BrowserRouter`.
 */
export const useLeaveGuard = (armed: boolean) => {
  const [pending, setPending] = useState<string | null>(null);

  useEffect(() => {
    if (!armed) return;

    const onBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || opensElsewhere(event)) return;

      const link = (event.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;

      if (!link || link.target === '_blank' || link.hasAttribute('download')) return;

      const url = new URL(link.href, window.location.href);

      if (url.origin !== window.location.origin || url.pathname + url.search === here()) return;

      event.preventDefault();
      setPending(url.pathname + url.search + url.hash);
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    // Capture: the router's own listener must not run first.
    document.addEventListener('click', onClick, true);

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      document.removeEventListener('click', onClick, true);
    };
  }, [armed]);

  return { pending, stay: () => setPending(null) };
};
