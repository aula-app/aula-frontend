import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ListFilterConfig, useListFilter } from './useListFilter';

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

type Item = { title: string; content: string; displayname: string; created: string; last_updated: string };

const items: Item[] = [
  { title: 'Banana', content: 'yellow fruit', displayname: 'Zoe', created: '2026-01-02', last_updated: '2026-03-01' },
  { title: 'Apple', content: 'red fruit', displayname: 'Ana', created: '2026-01-03', last_updated: '2026-02-01' },
  { title: 'Carrot', content: 'orange veggie', displayname: 'Mia', created: '2026-01-01', last_updated: '2026-04-01' },
];

const config: ListFilterConfig<Item> = {
  searchFields: ['title', 'content', 'displayname'],
  orderKeys: ['created', 'title'],
};

describe('useListFilter', () => {
  it('returns all items in original order by default', () => {
    const { result } = renderHook(() => useListFilter(items, config));
    expect(result.current.visibleItems).toEqual(items);
  });

  it('filters case-insensitively across the configured fields', () => {
    const { result } = renderHook(() => useListFilter(items, config));
    act(() => result.current.setSearchQuery('FRUIT'));
    expect(result.current.visibleItems.map((i) => i.title)).toEqual(['Banana', 'Apple']);
    act(() => result.current.setSearchQuery('zoe'));
    expect(result.current.visibleItems.map((i) => i.title)).toEqual(['Banana']);
  });

  it('sorts dates newest first and text alphabetically, without mutating the source', () => {
    const { result } = renderHook(() => useListFilter(items, config));
    act(() => result.current.setOrderBy('created'));
    expect(result.current.visibleItems.map((i) => i.title)).toEqual(['Apple', 'Banana', 'Carrot']);
    act(() => result.current.setOrderBy('title'));
    expect(result.current.visibleItems.map((i) => i.title)).toEqual(['Apple', 'Banana', 'Carrot']);
    expect(items[0].title).toBe('Banana');
    act(() => result.current.setOrderBy(''));
    expect(result.current.visibleItems).toEqual(items);
  });

  it('builds the sort options from the configured keys, prefixed by the default order', () => {
    const { result } = renderHook(() => useListFilter(items, config));
    expect(result.current.orderOptions).toEqual([
      { value: '', label: 'v2.ui.sort.default' },
      { value: 'created', label: 'v2.ui.sort.created' },
      { value: 'title', label: 'v2.ui.sort.title' },
    ]);
  });
});
