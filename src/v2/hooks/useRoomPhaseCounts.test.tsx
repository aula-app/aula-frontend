import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useRoomCounts, useRoomPhaseCounts } from './useRoomPhaseCounts';

const getIdeasByRoom = vi.fn();
const getBoxesByPhase = vi.fn();

vi.mock('@/services/ideas', () => ({ getIdeasByRoom: (...args: unknown[]) => getIdeasByRoom(...args) }));
vi.mock('@/services/boxes', () => ({ getBoxesByPhase: (...args: unknown[]) => getBoxesByPhase(...args) }));

const boxesIn = (...phases: number[]) => phases.map((phase_id) => ({ phase_id }));

beforeEach(() => {
  getIdeasByRoom.mockReset().mockResolvedValue({ data: [] });
  getBoxesByPhase.mockReset().mockResolvedValue({ data: [] });
});

describe('useRoomPhaseCounts', () => {
  it('counts ideas into phase 0 and groups boxes by their phase', async () => {
    getIdeasByRoom.mockResolvedValue({ data: [{}, {}, {}] });
    getBoxesByPhase.mockResolvedValue({ data: boxesIn(10, 10, 20, 40) });

    const { result } = renderHook(() => useRoomPhaseCounts(['r1']));

    await waitFor(() => expect(result.current.r1).toBeDefined());
    expect(result.current.r1).toEqual({ '0': 3, '10': 2, '20': 1, '30': 0, '40': 1 });
  });

  it('asks for every phase at once rather than one request per phase', async () => {
    renderHook(() => useRoomPhaseCounts(['r1']));

    await waitFor(() => expect(getBoxesByPhase).toHaveBeenCalled());
    expect(getBoxesByPhase).toHaveBeenCalledTimes(1);
    expect(getBoxesByPhase).toHaveBeenCalledWith(-1, 'r1');
  });

  it('reports a genuinely empty room as zeros, not as missing counts', async () => {
    getIdeasByRoom.mockResolvedValue({ error_code: 2, data: false });
    getBoxesByPhase.mockResolvedValue({ error_code: 2, data: false });

    const { result } = renderHook(() => useRoomPhaseCounts(['r1']));

    await waitFor(() => expect(result.current.r1).toBeDefined());
    expect(result.current.r1).toEqual({ '0': 0, '10': 0, '20': 0, '30': 0, '40': 0 });
  });

  it('leaves the box phases uncounted when that request fails, rather than claiming zero', async () => {
    getIdeasByRoom.mockResolvedValue({ data: [{}] });
    getBoxesByPhase.mockResolvedValue({ error_code: 1, data: false });

    const { result } = renderHook(() => useRoomPhaseCounts(['r1']));

    await waitFor(() => expect(result.current.r1).toBeDefined());
    expect(result.current.r1).toEqual({ '0': 1 });
  });

  it('counts each room separately', async () => {
    getBoxesByPhase.mockImplementation((_phase: number, room: string) =>
      Promise.resolve({ data: room === 'r1' ? boxesIn(10) : boxesIn(30, 30) })
    );

    const { result } = renderHook(() => useRoomPhaseCounts(['r1', 'r2']));

    await waitFor(() => expect(result.current.r2).toBeDefined());
    expect(result.current.r1?.['10']).toBe(1);
    expect(result.current.r2?.['30']).toBe(2);
  });

  it('asks for nothing until there are rooms to count', () => {
    renderHook(() => useRoomPhaseCounts([]));

    expect(getIdeasByRoom).not.toHaveBeenCalled();
    expect(getBoxesByPhase).not.toHaveBeenCalled();
  });

  it('refetches when the refresh key changes, but not on an unrelated rerender', async () => {
    const { rerender } = renderHook(({ key }: { key: string }) => useRoomPhaseCounts(['r1'], key), {
      initialProps: { key: '0' },
    });

    await waitFor(() => expect(getIdeasByRoom).toHaveBeenCalledTimes(1));

    rerender({ key: '0' });
    expect(getIdeasByRoom).toHaveBeenCalledTimes(1);

    rerender({ key: '20' });
    await waitFor(() => expect(getIdeasByRoom).toHaveBeenCalledTimes(2));
  });
});

describe('useRoomCounts', () => {
  it('returns the counts of the single room it was given', async () => {
    getIdeasByRoom.mockResolvedValue({ data: [{}, {}] });
    getBoxesByPhase.mockResolvedValue({ data: boxesIn(30) });

    const { result } = renderHook(() => useRoomCounts('r1'));

    await waitFor(() => expect(result.current).toBeDefined());
    expect(result.current).toEqual({ '0': 2, '10': 0, '20': 0, '30': 1, '40': 0 });
  });

  it('asks for nothing without a room', () => {
    const { result } = renderHook(() => useRoomCounts(undefined));

    expect(result.current).toBeUndefined();
    expect(getIdeasByRoom).not.toHaveBeenCalled();
  });
});
