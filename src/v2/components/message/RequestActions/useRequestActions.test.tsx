import { MessageType } from '@/types/Scopes';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useRequestActions } from './useRequestActions';

const calls: string[] = [];
const addMessage = vi.fn();
const deleteUser = vi.fn();
const editSelfRestricted = vi.fn();
const archiveMessage = vi.fn();
const toast = { error: vi.fn(), success: vi.fn() };

vi.mock('@/services/messages', () => ({ addMessage: (args: unknown) => addMessage(args) }));
vi.mock('@/services/users', () => ({
  deleteUser: (id: string) => deleteUser(id),
  editSelfRestricted: (args: unknown) => editSelfRestricted(args),
}));
vi.mock('@/v2/components/message/archiveMessage', () => ({ archiveMessage: (id: string) => archiveMessage(id) }));
vi.mock('@/v2/hooks', () => ({ useToast: () => ({ toast }) }));
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

const request = { hash_id: 'm1', headline: 'Account deletion request for aula', creator_id: 7 } as MessageType;
const deletion = { type: 'deleteAccount', id: 'u1', username: 'aula' };
const rename = { type: 'changeName', id: 'u1', property: 'displayname', value: 'Aula' };

const track = (name: string, response: object = { error: null }) =>
  vi.fn(async () => {
    calls.push(name);
    return response;
  });

beforeEach(() => {
  calls.length = 0;
  addMessage.mockReset().mockImplementation(track('reply'));
  deleteUser.mockReset().mockImplementation(track('delete'));
  editSelfRestricted.mockReset().mockImplementation(track('rename'));
  archiveMessage.mockReset().mockImplementation(track('archive'));
  toast.error.mockReset();
  toast.success.mockReset();
});

describe('useRequestActions', () => {
  it('deletes the account, replies to the requester and archives, in that order', async () => {
    const onDone = vi.fn();
    const { result } = renderHook(() => useRequestActions(request, deletion, onDone));

    await act(() => result.current.confirm());

    expect(calls).toEqual(['delete', 'reply', 'archive']);
    expect(deleteUser).toHaveBeenCalledWith('u1');
    expect(addMessage).toHaveBeenCalledWith({
      msg_type: 6,
      headline: request.headline,
      body: '\n---\nresponseTo: deleteAccount\nid: u1\nusername: aula\n---\nrequests.accepted',
      target_id: 7,
    });
    expect(archiveMessage).toHaveBeenCalledWith('m1');
    expect(toast.success).toHaveBeenCalledWith('requests.confirm');
    expect(onDone).toHaveBeenCalled();
  });

  it('applies a name change to the requested field', async () => {
    const { result } = renderHook(() => useRequestActions(request, rename));

    await act(() => result.current.confirm());

    expect(editSelfRestricted).toHaveBeenCalledWith({ field: 'displayname', id: 'u1', value: 'Aula' });
  });

  it('stops without replying or archiving when the change itself fails', async () => {
    deleteUser.mockImplementation(track('delete', { error: 'errors.failed' }));
    const onDone = vi.fn();
    const { result } = renderHook(() => useRequestActions(request, deletion, onDone));

    await act(() => result.current.confirm());

    expect(calls).toEqual(['delete']);
    expect(toast.error).toHaveBeenCalledWith('errors.failed');
    expect(onDone).not.toHaveBeenCalled();
  });

  it('rejects by replying and archiving, without touching the account', async () => {
    const { result } = renderHook(() => useRequestActions(request, deletion));

    await act(() => result.current.reject());

    expect(calls).toEqual(['reply', 'archive']);
    expect(addMessage.mock.calls[0][0].body).toContain('requests.denied');
    expect(toast.success).toHaveBeenCalledWith('requests.cancel');
  });
});
