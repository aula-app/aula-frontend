import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSsoStatus } from './useSsoStatus';

const getSsoStatus = vi.fn();
vi.mock('@/services/sso', () => ({ getSsoStatus: (apiUrl: string) => getSsoStatus(apiUrl) }));
vi.mock('@/utils', () => ({ localStorageGet: () => 'https://api.example' }));

const enabled = { enabled: true, required: false, provider: 'eduplaces' };
const disabled = { enabled: false, required: false, provider: null };

describe('useSsoStatus', () => {
  beforeEach(() => {
    getSsoStatus.mockReset();
  });

  it('is undefined until the first answer arrives', async () => {
    getSsoStatus.mockResolvedValue(enabled);
    const { result } = renderHook(() => useSsoStatus('school-a'));

    expect(result.current).toBeUndefined();
    await waitFor(() => expect(result.current).toEqual(enabled));
  });

  it('checks again when the instance code changes', async () => {
    getSsoStatus.mockResolvedValueOnce(disabled);
    const { result, rerender } = renderHook(({ code }) => useSsoStatus(code), {
      initialProps: { code: 'school-a' },
    });
    await waitFor(() => expect(result.current).toEqual(disabled));

    let answer: (status: typeof enabled) => void = () => {};
    getSsoStatus.mockReturnValueOnce(new Promise((resolve) => (answer = resolve)));
    rerender({ code: 'school-b' });

    expect(result.current).toBeNull();
    answer(enabled);
    await waitFor(() => expect(result.current).toEqual(enabled));
    expect(getSsoStatus).toHaveBeenCalledTimes(2);
  });

  it('checks only once without an instance code', async () => {
    getSsoStatus.mockResolvedValue(enabled);
    const { result, rerender } = renderHook(() => useSsoStatus());
    await waitFor(() => expect(result.current).toEqual(enabled));

    rerender();
    expect(getSsoStatus).toHaveBeenCalledTimes(1);
  });
});
