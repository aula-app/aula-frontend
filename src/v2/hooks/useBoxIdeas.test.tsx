import { getIdeasByBox } from '@/services/ideas';
import { BoxType, IdeaType } from '@/types/Scopes';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useBoxIdeas } from './useBoxIdeas';

vi.mock('@/services/ideas', () => ({ getIdeasByBox: vi.fn() }));

const boxes = [{ hash_id: 'b1' }, { hash_id: 'b2' }] as BoxType[];
const ideas = [{ hash_id: 'i1', title: 'One' }] as IdeaType[];

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getIdeasByBox).mockResolvedValue({ data: ideas } as any);
});

describe('useBoxIdeas', () => {
  it('returns the ideas of each box, keyed by box', async () => {
    const { result } = renderHook(() => useBoxIdeas(boxes));

    await waitFor(() => expect(result.current.b1).toEqual(ideas));
    expect(result.current.b2).toEqual(ideas);
  });

  it('fetches once per box', async () => {
    renderHook(() => useBoxIdeas(boxes));

    await waitFor(() => expect(getIdeasByBox).toHaveBeenCalledTimes(2));
    expect(vi.mocked(getIdeasByBox).mock.calls.map(([args]) => args.topic_id)).toEqual(['b1', 'b2']);
  });

  it('reports an empty box as an empty list rather than undefined', async () => {
    vi.mocked(getIdeasByBox).mockResolvedValue({ data: null } as any);

    const { result } = renderHook(() => useBoxIdeas(boxes));

    await waitFor(() => expect(result.current.b1).toEqual([]));
  });

  it('stays quiet when disabled', async () => {
    const { result } = renderHook(() => useBoxIdeas(boxes, false));

    expect(result.current).toEqual({});
    expect(getIdeasByBox).not.toHaveBeenCalled();
  });

  it('does not refetch when the box list is unchanged', async () => {
    const { rerender } = renderHook(({ list }) => useBoxIdeas(list), { initialProps: { list: boxes } });
    await waitFor(() => expect(getIdeasByBox).toHaveBeenCalledTimes(2));

    rerender({ list: [...boxes] });

    await waitFor(() => expect(getIdeasByBox).toHaveBeenCalledTimes(2));
  });
});
