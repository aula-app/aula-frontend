import { act, renderHook } from '@testing-library/react';
import { UIEvent } from 'react';
import { describe, expect, it } from 'vitest';
import { useCollapseOnScroll } from './useCollapseOnScroll';

const scrollEvent = (scrollTop: number, scrollHeight = 1000, clientHeight = 400) =>
  ({ currentTarget: { scrollTop, scrollHeight, clientHeight } }) as unknown as UIEvent<HTMLElement>;

describe('useCollapseOnScroll', () => {
  it('collapses once the list scrolls and reopens back at the top', () => {
    const { result } = renderHook(() => useCollapseOnScroll());
    expect(result.current.open).toBe(true);

    act(() => result.current.onScroll(scrollEvent(120)));
    expect(result.current.open).toBe(false);

    act(() => result.current.onScroll(scrollEvent(0)));
    expect(result.current.open).toBe(true);
  });

  it('stays collapsed when the list no longer overflows', () => {
    const { result } = renderHook(() => useCollapseOnScroll());

    act(() => result.current.onScroll(scrollEvent(120)));
    act(() => result.current.onScroll(scrollEvent(0, 400, 400)));
    expect(result.current.open).toBe(false);
  });
});
