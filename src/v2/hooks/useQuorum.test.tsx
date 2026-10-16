import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getQuorum } from '@/services/vote';
import { useQuorum } from './useQuorum';

vi.mock('@/services/vote', () => ({ getQuorum: vi.fn() }));

const respondWith = (quorum_wild_ideas: number, quorum_votes: number) =>
  vi.mocked(getQuorum).mockResolvedValue({ data: { quorum_wild_ideas, quorum_votes } } as any);

beforeEach(() => {
  vi.clearAllMocks();
  respondWith(10, 50);
});

describe('useQuorum', () => {
  it('uses the voting quorum from the voting phase onwards', async () => {
    const { result } = renderHook(() => useQuorum('30'));

    await waitFor(() => expect(result.current).toBe(50));
  });

  it('still uses the voting quorum after the voting phase', async () => {
    const { result } = renderHook(() => useQuorum('40'));

    await waitFor(() => expect(result.current).toBe(50));
  });

  it('reports no quorum in the approval phase, which is decided by review', async () => {
    const { result } = renderHook(() => useQuorum('20'));

    expect(result.current).toBe(0);
    expect(getQuorum).not.toHaveBeenCalled();
  });

  it('uses the wild-ideas quorum in the wild phase', async () => {
    const { result } = renderHook(() => useQuorum('0'));

    await waitFor(() => expect(getQuorum).toHaveBeenCalled());
    expect(result.current).toBe(10);
  });

  it('falls back to the wild-ideas quorum when the phase is unknown', async () => {
    const { result } = renderHook(() => useQuorum(undefined));

    await waitFor(() => expect(getQuorum).toHaveBeenCalled());
    expect(result.current).toBe(10);
  });

  it('reports no quorum when the endpoint returns none', async () => {
    vi.mocked(getQuorum).mockResolvedValue({ data: null } as any);

    const { result } = renderHook(() => useQuorum('30'));

    await waitFor(() => expect(getQuorum).toHaveBeenCalled());
    expect(result.current).toBe(0);
  });

  it('reports no quorum when the configured value is not a number', async () => {
    vi.mocked(getQuorum).mockResolvedValue({ data: { quorum_votes: null, quorum_wild_ideas: null } } as any);

    const { result } = renderHook(() => useQuorum('30'));

    await waitFor(() => expect(getQuorum).toHaveBeenCalled());
    expect(result.current).toBe(0);
  });

  it('refetches when the phase changes', async () => {
    const { result, rerender } = renderHook(({ phase }) => useQuorum(phase), {
      initialProps: { phase: '0' as string | undefined },
    });
    await waitFor(() => expect(result.current).toBe(10));

    rerender({ phase: '30' });

    await waitFor(() => expect(result.current).toBe(50));
  });
});
