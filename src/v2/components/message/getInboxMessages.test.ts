import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getInboxMessages } from './getInboxMessages';

const getAdminMessages = vi.fn();
const getPersonalMessages = vi.fn();
const checkPermissions = vi.fn();

vi.mock('@/services/messages', () => ({
  getAdminMessages: () => getAdminMessages(),
  getPersonalMessages: () => getPersonalMessages(),
}));
vi.mock('@/utils', () => ({ checkPermissions: (...args: unknown[]) => checkPermissions(...args) }));

beforeEach(() => {
  checkPermissions.mockReset().mockReturnValue(false);
  getPersonalMessages.mockReset().mockResolvedValue({ data: [{ hash_id: 'p', status: 1 }], error: null });
  getAdminMessages.mockReset().mockResolvedValue({
    data: [
      { hash_id: 'a', status: 1 },
      { hash_id: 'b', status: '3' },
      { hash_id: 'c', status: '1' },
    ],
    error: null,
  });
});

describe('getInboxMessages', () => {
  it('gives regular users their personal messages', async () => {
    const response = await getInboxMessages();

    expect(response.data?.map((message) => message.hash_id)).toEqual(['p']);
    expect(getAdminMessages).not.toHaveBeenCalled();
  });

  it('gives admins every active message, leaving out archived ones', async () => {
    checkPermissions.mockReturnValue(true);
    const response = await getInboxMessages();

    expect(response.data?.map((message) => message.hash_id)).toEqual(['a', 'c']);
  });

  it('passes an empty or failed response through unchanged', async () => {
    const empty = { data: null, error: 'errors.existingUser', error_code: 2 };
    getPersonalMessages.mockResolvedValue(empty);

    expect(await getInboxMessages()).toBe(empty);
  });
});
