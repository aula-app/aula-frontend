import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

type SortableFields = {
  created?: string;
  last_updated?: string;
  displayname?: string;
  title?: string;
};

export type OrderKey = keyof SortableFields;

// Date fields compare lexicographically (API format 'YYYY-MM-DD HH:MM:SS'), newest first.
const orderConfig: Record<OrderKey, { labelKey: string; compare: (a: SortableFields, b: SortableFields) => number }> = {
  created: { labelKey: 'v2.ui.sort.created', compare: (a, b) => (b.created ?? '').localeCompare(a.created ?? '') },
  last_updated: {
    labelKey: 'v2.ui.sort.updated',
    compare: (a, b) => (b.last_updated ?? '').localeCompare(a.last_updated ?? ''),
  },
  displayname: {
    labelKey: 'v2.ui.sort.user',
    compare: (a, b) => (a.displayname ?? '').localeCompare(b.displayname ?? ''),
  },
  title: { labelKey: 'v2.ui.sort.title', compare: (a, b) => (a.title ?? '').localeCompare(b.title ?? '') },
};

export interface ListFilterConfig<T> {
  /** Item fields matched against the search query. */
  searchFields: (keyof T)[];
  /** Fields offered in the sort dropdown. The first one is the initial sort. */
  orderKeys?: OrderKey[];
}

type FilterState = { searchQuery: string; orderBy: string; reversed: boolean };

/**
 * In-memory search/sort selections keyed per list. Module-level so a selection
 * survives navigating away and back (e.g. into an idea's detail and back to the
 * list), mirroring `useScrollRestoration`. Resets on a full page reload.
 */
const filterStates = new Map<string, FilterState>();

/**
 * Client-side search and sort for scope lists.
 * Pass a module-level config object so the memo dependencies stay stable.
 *
 * @param storageKey Optional unique per list (e.g. `ideas-${room_id}`). When
 *                   provided, the search query, sort field and direction
 *                   persist across navigation.
 */
export const useListFilter = <T extends SortableFields>(
  items: T[],
  { searchFields, orderKeys = [] }: ListFilterConfig<T>,
  storageKey?: string
) => {
  const { t } = useTranslation();
  const stored = storageKey ? filterStates.get(storageKey) : undefined;
  const [searchQuery, setSearchQuery] = useState(stored?.searchQuery ?? '');
  const [orderBy, setOrderBy] = useState<string>(stored?.orderBy ?? orderKeys[0] ?? '');
  const [reversed, setReversed] = useState(stored?.reversed ?? false);

  useEffect(() => {
    if (storageKey) filterStates.set(storageKey, { searchQuery, orderBy, reversed });
  }, [storageKey, searchQuery, orderBy, reversed]);

  const orderOptions = orderKeys.map((key) => ({ value: key, label: t(orderConfig[key].labelKey) }));

  const visibleItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const filtered = query
      ? items.filter((item) =>
          searchFields.some((field) =>
            String(item[field] ?? '')
              .toLowerCase()
              .includes(query)
          )
        )
      : items;
    const compare = orderConfig[orderBy as OrderKey]?.compare;
    const ordered = compare ? [...filtered].sort(compare) : filtered;
    return reversed ? [...ordered].reverse() : ordered;
  }, [items, searchQuery, orderBy, reversed, searchFields]);

  return { visibleItems, searchQuery, setSearchQuery, orderBy, setOrderBy, orderOptions, reversed, setReversed };
};
