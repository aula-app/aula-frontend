import { useMemo, useState } from 'react';

export type Comparators<T> = Record<string, (a: T, b: T) => number>;

/**
 * Client-side ordering for a list, with a reversible direction.
 *
 * Comparators are supplied by the caller rather than chosen from a fixed set of
 * field names, so a list of any shape can use this. Pass a module-level object
 * so the memo dependencies stay stable.
 *
 * @param initial Key to start on. Defaults to the first comparator given.
 */
export const useListSort = <T>(items: T[], comparators: Comparators<T>, initial?: string) => {
  const [orderBy, setOrderBy] = useState(initial ?? Object.keys(comparators)[0] ?? '');
  const [reversed, setReversed] = useState(false);

  const sorted = useMemo(() => {
    const compare = comparators[orderBy];

    if (!compare) return items;

    const ordered = [...items].sort(compare);

    return reversed ? ordered.reverse() : ordered;
  }, [items, comparators, orderBy, reversed]);

  return { sorted, orderBy, setOrderBy, reversed, setReversed };
};
