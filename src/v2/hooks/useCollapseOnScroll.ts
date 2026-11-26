import { UIEvent, useRef, useState } from 'react';

/** Open state for a panel above a scroll list: open at the top of the list, collapsed once it scrolls. */
export const useCollapseOnScroll = (initialOpen = true) => {
  const [open, setOpen] = useState(initialOpen);
  const ref = useRef<HTMLElement>(null);

  const onScroll = (e: UIEvent<HTMLElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    // Collapsing grows the list; if it then fits, scrollTop snaps to 0 and must not reopen the panel.
    if (scrollHeight <= clientHeight) return;
    const nextOpen = scrollTop === 0;
    // Collapsing makes the panel inert, which would drop focus held inside it.
    if (!nextOpen && ref.current?.contains(document.activeElement)) return;
    setOpen(nextOpen);
  };

  return { open, setOpen, onScroll, ref };
};
