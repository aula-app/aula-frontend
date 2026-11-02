import { useEffect, useRef } from 'react';

/**
 * In-memory scroll positions keyed per list. Module-level so a position
 * survives navigating away and back (e.g. into an idea's detail and back to the
 * list) but resets on a full page reload — restoring a stale offset against
 * freshly-loaded content would be more confusing than helpful.
 */
const scrollPositions = new Map<string, number>();

/**
 * Remembers and restores the scroll offset of a scroll container across
 * navigation. Attach the returned ref to the element that actually scrolls.
 *
 * @param key    Unique per list (e.g. `ideas-${room_id}`). Different keys are
 *               kept independently, so sibling lists never clobber each other.
 * @param ready  Whether the scrollable content is present. Restoration waits
 *               for this so the element has enough height to scroll to.
 */
export const useScrollRestoration = <T extends HTMLElement>(key: string, ready: boolean) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !ready) return;

    const saved = scrollPositions.get(key);
    if (saved !== undefined) el.scrollTop = saved;

    const handleScroll = () => scrollPositions.set(key, el.scrollTop);
    el.addEventListener('scroll', handleScroll, { passive: true });

    // No position capture here: on unmount this cleanup runs after React has
    // detached the element, where scrollTop always reads 0 and would clobber
    // the value the scroll listener saved. The listener alone keeps the map
    // current.
    return () => el.removeEventListener('scroll', handleScroll);
  }, [key, ready]);

  return ref;
};
