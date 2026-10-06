import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Pending = { kind: 'link'; to: string } | { kind: 'back' };

const opensElsewhere = (event: MouseEvent) =>
  event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

const here = () => window.location.pathname + window.location.search;

/**
 * Holds back a departure while there is unsaved work; `leave()` then performs it.
 *
 * Back is caught by keeping a spare copy of this entry on the stack, since blocking a traversal
 * needs a data router. The copy costs what `pushState` costs: forward history is dropped, and the
 * spare outlives the guard, so one Back lands here again before the next one leaves.
 */
export const useLeaveGuard = (armed: boolean) => {
  const [pending, setPending] = useState<Pending | null>(null);
  const navigate = useNavigate();
  /** Set while a confirmed departure is under way, so the guard ignores its own traversal. */
  const going = useRef(false);

  useEffect(() => {
    if (!armed) return;

    going.current = false;
    // Carrying the router's own state keeps the history index it tracks intact.
    window.history.pushState(window.history.state, '', window.location.href);

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      // A confirmed departure can still unload the document: do not ask twice.
      if (going.current) return;

      event.preventDefault();
    };

    const onPopState = () => {
      if (going.current) return;

      window.history.pushState(window.history.state, '', window.location.href);
      setPending({ kind: 'back' });
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || opensElsewhere(event)) return;

      const link = (event.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;

      if (!link || link.target === '_blank' || link.hasAttribute('download')) return;

      const url = new URL(link.href, window.location.href);

      if (url.origin !== window.location.origin || url.pathname + url.search === here()) return;

      event.preventDefault();
      setPending({ kind: 'link', to: url.pathname + url.search + url.hash });
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    window.addEventListener('popstate', onPopState);
    // Capture: the router's own listener must not run first.
    document.addEventListener('click', onClick, true);

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      window.removeEventListener('popstate', onPopState);
      document.removeEventListener('click', onClick, true);
    };
  }, [armed]);

  const stay = useCallback(() => setPending(null), []);

  const leave = useCallback(() => {
    if (!pending) return;

    going.current = true;
    setPending(null);

    // Past the spare and the page itself.
    if (pending.kind === 'back') window.history.go(-2);
    else navigate(pending.to, { replace: true });
  }, [navigate, pending]);

  return { asking: !!pending, stay, leave };
};
