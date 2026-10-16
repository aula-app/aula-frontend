import { useScrollRestoration } from '@/v2/hooks';
import React, { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type ScrollListProps = {
  /** Unique per list (e.g. `ideas-${room_id}`), keys the remembered scroll position. */
  storageKey: string;
  children: ReactNode;
  className?: string;
};

const ScrollList = ({ storageKey, children, className }: ScrollListProps) => {
  const listRef = useScrollRestoration<HTMLUListElement>(storageKey, true);

  return (
    <ul ref={listRef} className={twMerge('flex-1 flex flex-col gap-4 p-2 sm:p-4 overflow-y-auto', className)}>
      {children}
    </ul>
  );
};

export default ScrollList;
