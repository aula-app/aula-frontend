import { getIdeasByBox } from '@/services/ideas';
import { BoxType, IdeaType } from '@/types/Scopes';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useBoxApprovals } from './useBoxApprovals';

vi.mock('@/services/ideas', () => ({ getIdeasByBox: vi.fn() }));

const boxes = [{ hash_id: 'b1' }, { hash_id: 'b2' }] as BoxType[];

const ideasWith = (...approvals: number[]) =>
  ({ data: approvals.map((approved) => ({ approved })) as IdeaType[] }) as any;

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getIdeasByBox).mockResolvedValue(ideasWith(1, -1, 0));
});

describe('useBoxApprovals', () => {
  it('counts approved and rejected ideas as reviewed, and pending as outstanding', async () => {
    const { result } = renderHook(() => useBoxApprovals(boxes, true));

    await waitFor(() => expect(result.current.b1).toEqual({ reviewed: 2, total: 3 }));
    expect(result.current.b2).toEqual({ reviewed: 2, total: 3 });
  });

  it('fetches once per box', async () => {
    renderHook(() => useBoxApprovals(boxes, true));

    await waitFor(() => expect(getIdeasByBox).toHaveBeenCalledTimes(2));
    expect(vi.mocked(getIdeasByBox).mock.calls.map(([args]) => args.topic_id)).toEqual(['b1', 'b2']);
  });

  it('stays quiet outside the approval phase', async () => {
    const { result } = renderHook(() => useBoxApprovals(boxes, false));

    expect(result.current).toEqual({});
    expect(getIdeasByBox).not.toHaveBeenCalled();
  });

  it('reports an empty box as nothing to review', async () => {
    vi.mocked(getIdeasByBox).mockResolvedValue({ data: null } as any);

    const { result } = renderHook(() => useBoxApprovals(boxes, true));

    await waitFor(() => expect(result.current.b1).toEqual({ reviewed: 0, total: 0 }));
  });

  it('does not refetch when the box list is unchanged', async () => {
    const { rerender } = renderHook(({ list }) => useBoxApprovals(list, true), { initialProps: { list: boxes } });
    await waitFor(() => expect(getIdeasByBox).toHaveBeenCalledTimes(2));

    rerender({ list: [...boxes] });

    await waitFor(() => expect(getIdeasByBox).toHaveBeenCalledTimes(2));
  });
});
