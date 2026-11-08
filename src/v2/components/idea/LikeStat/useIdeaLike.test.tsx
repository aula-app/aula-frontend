import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { addIdeaLike, getIdeaLike, removeIdeaLike } from '@/services/ideas';
import { IdeaType } from '@/types/Scopes';
import { useIdeaLike } from './useIdeaLike';

const dispatch = vi.hoisted(() => vi.fn());

vi.mock('@/services/ideas', () => ({
  getIdeaLike: vi.fn(),
  addIdeaLike: vi.fn(),
  removeIdeaLike: vi.fn(),
}));
vi.mock('@/store', () => ({ useAppStore: () => [{}, dispatch] }));
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

const idea = { hash_id: 'idea-1', sum_likes: 3 } as IdeaType;

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getIdeaLike).mockResolvedValue(false);
  vi.mocked(addIdeaLike).mockResolvedValue({ error: null } as any);
  vi.mocked(removeIdeaLike).mockResolvedValue({ error: null } as any);
});

describe('useIdeaLike', () => {
  it('reflects the fetched like status without changing the count', async () => {
    vi.mocked(getIdeaLike).mockResolvedValue(true);

    const { result } = renderHook(() => useIdeaLike(idea));

    await waitFor(() => expect(result.current.liked).toBe(true));
    expect(result.current.count).toBe(3);
  });

  it('likes optimistically and increments the count', async () => {
    const { result } = renderHook(() => useIdeaLike(idea));
    await waitFor(() => expect(getIdeaLike).toHaveBeenCalled());

    await act(async () => result.current.toggle());

    expect(result.current.liked).toBe(true);
    expect(result.current.count).toBe(4);
    expect(addIdeaLike).toHaveBeenCalledWith('idea-1');
  });

  it('unlikes a previously liked idea and decrements the count', async () => {
    vi.mocked(getIdeaLike).mockResolvedValue(true);

    const { result } = renderHook(() => useIdeaLike(idea));
    await waitFor(() => expect(result.current.liked).toBe(true));

    await act(async () => result.current.toggle());

    expect(result.current.liked).toBe(false);
    expect(result.current.count).toBe(2);
    expect(removeIdeaLike).toHaveBeenCalledWith('idea-1');
  });

  it('reverts the toggle and toasts when the request fails', async () => {
    vi.mocked(addIdeaLike).mockResolvedValue({ error: 'boom' } as any);

    const { result } = renderHook(() => useIdeaLike(idea));
    await waitFor(() => expect(getIdeaLike).toHaveBeenCalled());

    await act(async () => result.current.toggle());

    expect(result.current.liked).toBe(false);
    expect(result.current.count).toBe(3);
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'ADD_TOAST', message: expect.objectContaining({ type: 'error' }) })
    );
  });

  it('ignores toggles while a request is pending', async () => {
    let resolveAdd!: (value: unknown) => void;
    vi.mocked(addIdeaLike).mockReturnValue(new Promise((resolve) => (resolveAdd = resolve)) as any);

    const { result } = renderHook(() => useIdeaLike(idea));
    await waitFor(() => expect(getIdeaLike).toHaveBeenCalled());

    act(() => void result.current.toggle());
    expect(result.current.pending).toBe(true);
    expect(result.current.liked).toBe(true);

    act(() => void result.current.toggle());
    await act(async () => resolveAdd({ error: null }));

    expect(addIdeaLike).toHaveBeenCalledTimes(1);
    expect(removeIdeaLike).not.toHaveBeenCalled();
    expect(result.current.liked).toBe(true);
  });
});
