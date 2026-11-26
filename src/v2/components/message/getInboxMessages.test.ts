import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getInboxMessages } from './getInboxMessages';

const getAdminMessages = vi.fn();
const getPersonalMessages = vi.fn();
const checkPermissions = vi.fn();

vi.mock('@/services/messages', () => ({
  getAdminMessages: (status: number) => getAdminMessages(status),
  getPersonalMessages: (status: number) => getPersonalMessages(status),
}));
vi.mock('@/utils', () => ({ checkPermissions: (...args: unknown[]) => checkPermissions(...args) }));

const personal = [
  { hash_id: 'p1', status: 1 },
  { hash_id: 'p3', status: '3' },
];
const untargeted = [
  { hash_id: 'a', status: 1 },
  { hash_id: 'b', status: '3' },
  { hash_id: 'd', status: 0 },
];
const byStatus = (status: number) => personal.filter((message) => Number(message.status) === status);

beforeEach(() => {
  checkPermissions.mockReset().mockReturnValue(false);
  getPersonalMessages.mockReset().mockImplementation(async (status) => ({ data: byStatus(status), error: null }));
  getAdminMessages
    .mockReset()
    .mockImplementation(async (status) => ({ data: [...byStatus(status), ...untargeted], error: null }));
});

const ids = (response: Awaited<ReturnType<typeof getInboxMessages>>) =>
  response.data?.map((message) => message.hash_id);

describe('getInboxMessages', () => {
  it('gives regular users their active personal messages', async () => {
    const response = await getInboxMessages();

    expect(ids(response)).toEqual(['p1']);
    expect(getPersonalMessages).toHaveBeenCalledWith(1);
    expect(getAdminMessages).not.toHaveBeenCalled();
  });

  it('gives regular users their archived personal messages', async () => {
    const response = await getInboxMessages('archived');

    expect(ids(response)).toEqual(['p3']);
    expect(getPersonalMessages).toHaveBeenCalledWith(3);
  });

  it('gives admins every active message, leaving out archived ones', async () => {
    checkPermissions.mockReturnValue(true);
    const response = await getInboxMessages();

    expect(ids(response)).toEqual(['p1', 'a']);
    expect(getAdminMessages).toHaveBeenCalledWith(1);
  });

  it('asks for the admin-only list only with the admin-only permission', async () => {
    await getInboxMessages();

    expect(checkPermissions).toHaveBeenCalledWith('messages', 'viewAll');
  });

  it('gives admins only the archived messages when asked for them', async () => {
    checkPermissions.mockReturnValue(true);
    const response = await getInboxMessages('archived');

    expect(ids(response)).toEqual(['p3', 'b']);
    expect(getAdminMessages).toHaveBeenCalledWith(3);
  });

  it('gives admins both active and archived messages once each when asked for all', async () => {
    checkPermissions.mockReturnValue(true);
    const response = await getInboxMessages('all');

    expect(ids(response)).toEqual(['p1', 'a', 'b', 'p3']);
    expect(getAdminMessages).toHaveBeenCalledTimes(2);
  });

  it('passes an empty or failed response through unchanged', async () => {
    const empty = { data: null, error: 'errors.existingUser', error_code: 2 };
    getPersonalMessages.mockResolvedValue(empty);

    expect(await getInboxMessages()).toBe(empty);
  });
});
