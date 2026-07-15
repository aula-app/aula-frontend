import { useMemo, useState } from 'react';
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
  /** Fields offered in the sort dropdown, in order. */
  orderKeys?: OrderKey[];
}

/**
 * Client-side search and sort for scope lists.
 * Pass a module-level config object so the memo dependencies stay stable.
 */
export const useListFilter = <T extends SortableFields>(
  items: T[],
  { searchFields, orderKeys = [] }: ListFilterConfig<T>
) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [orderBy, setOrderBy] = useState('');

  const orderOptions = [
    { value: '', label: t('v2.ui.sort.default') },
    ...orderKeys.map((key) => ({ value: key, label: t(orderConfig[key].labelKey) })),
  ];

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
    return compare ? [...filtered].sort(compare) : filtered;
  }, [items, searchQuery, orderBy, searchFields]);

  return { visibleItems, searchQuery, setSearchQuery, orderBy, setOrderBy, orderOptions };
};
