import { act, renderHook, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useMessageCount, useUpdateCount } from './useActivityCounts';

const getInboxMessages = vi.fn();
const getUpdates = vi.fn();

vi.mock('@/v2/components/message/getInboxMessages', () => ({ getInboxMessages: () => getInboxMessages() }));
vi.mock('@/services/dashboard', () => ({ getUpdates: () => getUpdates() }));

const wrapper = ({ children }: { children: ReactNode }) => <MemoryRouter>{children}</MemoryRouter>;

beforeEach(() => {
  getInboxMessages.mockReset().mockResolvedValue({ data: [{}, {}, {}, {}], error: null });
  getUpdates.mockReset().mockResolvedValue({ count: 15 });
});

describe('useMessageCount', () => {
  it('counts the inbox the Messages page lists', async () => {
    const { result } = renderHook(() => useMessageCount(), { wrapper });

    await waitFor(() => expect(result.current).toBe(4));
  });

  it('reads an empty inbox as zero and a failure as unknown', async () => {
    getInboxMessages.mockResolvedValueOnce({ data: null, error: 'x', error_code: 2 });
    const empty = renderHook(() => useMessageCount(), { wrapper });
    await waitFor(() => expect(empty.result.current).toBe(0));

    getInboxMessages.mockRejectedValueOnce(new Error('offline'));
    const failed = renderHook(() => useMessageCount(), { wrapper });
    await waitFor(() => expect(getInboxMessages).toHaveBeenCalledTimes(2));
    expect(failed.result.current).toBeUndefined();
  });

  it('refetches after navigating, so archiving shows up', async () => {
    const { result } = renderHook(() => ({ count: useMessageCount(), navigate: useNavigate() }), { wrapper });
    await waitFor(() => expect(result.current.count).toBe(4));

    getInboxMessages.mockResolvedValue({ data: [{}, {}, {}], error: null });
    act(() => result.current.navigate('/messages'));

    await waitFor(() => expect(result.current.count).toBe(3));
  });
});

describe('useUpdateCount', () => {
  it('uses the count the updates endpoint reports', async () => {
    const { result } = renderHook(() => useUpdateCount(), { wrapper });

    await waitFor(() => expect(result.current).toBe(15));
  });
});
