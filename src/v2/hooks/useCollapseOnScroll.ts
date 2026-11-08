import { UIEvent, useState } from 'react';

/** Open state for a panel above a scroll list: open at the top of the list, collapsed once it scrolls. */
export const useCollapseOnScroll = (initialOpen = true) => {
  const [open, setOpen] = useState(initialOpen);

  const onScroll = (e: UIEvent<HTMLElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    // Collapsing grows the list; if it then fits, scrollTop snaps to 0 and must not reopen the panel.
    if (scrollHeight <= clientHeight) return;
    setOpen(scrollTop === 0);
  };

  return { open, setOpen, onScroll };
};
