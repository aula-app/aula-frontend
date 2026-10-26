import { MessageType } from '@/types/Scopes';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Messages from './Messages';

const getAdminMessages = vi.fn();
const getPersonalMessages = vi.fn();
const checkPermissions = vi.fn();
const isDrawerMode = vi.fn();

vi.mock('@/services/messages', () => ({
  getAdminMessages: () => getAdminMessages(),
  getPersonalMessages: () => getPersonalMessages(),
}));
vi.mock('@/utils', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  checkPermissions: (...args: unknown[]) => checkPermissions(...args),
}));
vi.mock('@/store/AppStore', () => ({ useAppStore: () => [{ breadcrumb: [] }, () => {}] }));
vi.mock('@/v2/hooks/useIsDrawerMode', () => ({ default: () => isDrawerMode() }));
vi.mock('@/v2/components/message/MessageCard', () => ({
  default: ({ message, selected }: { message: MessageType; selected: boolean }) => (
    <div data-testid="message-card" aria-current={selected || undefined}>
      {message.headline}
    </div>
  ),
}));
vi.mock('@/v2/components/message/MessageDetail', () => ({
  default: ({ message, onClose }: { message: MessageType; onClose?: () => void }) => (
    <div data-testid="message-detail">
      {message.headline}
      {onClose && <button onClick={onClose}>close</button>}
    </div>
  ),
}));
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, vars?: Record<string, unknown>) => (vars ? `${key}:${JSON.stringify(vars)}` : key),
  }),
}));

const messageList = (...headlines: string[]) =>
  headlines.map((headline, i) => ({ hash_id: `m${i}`, headline, body: '', status: 1, msg_type: 1 }) as MessageType);

const renderView = (path = '/messages') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="messages/:message_id?" element={<Messages />} />
      </Routes>
    </MemoryRouter>
  );

beforeEach(() => {
  checkPermissions.mockReset().mockReturnValue(false);
  isDrawerMode.mockReset().mockReturnValue(false);
  getPersonalMessages.mockReset().mockResolvedValue({ data: messageList('Welcome', 'Data export request') });
  getAdminMessages.mockReset().mockResolvedValue({ data: messageList('Bug report on /messages') });
});

describe('Messages', () => {
  it('lists the personal messages of a regular user', async () => {
    renderView();

    await waitFor(() => expect(screen.getAllByTestId('message-item')).toHaveLength(2));
    expect(getAdminMessages).not.toHaveBeenCalled();
  });

  it('lists the admin messages for users who can view all reports', async () => {
    checkPermissions.mockReturnValue(true);
    renderView();

    await screen.findByText('Bug report on /messages');
    expect(getPersonalMessages).not.toHaveBeenCalled();
  });

  it('leaves out archived messages, which the admin query still returns', async () => {
    checkPermissions.mockReturnValue(true);
    getAdminMessages.mockResolvedValue({
      data: [...messageList('Open'), { ...messageList('Archived')[0], hash_id: 'm9', status: '3' }],
    });
    renderView();

    await screen.findByText('Open');
    expect(screen.queryByText('Archived')).toBeNull();
  });

  it('shows the empty state when there are no messages', async () => {
    getPersonalMessages.mockResolvedValue({ error_code: 2, error: 'errors.existingUser', data: null });
    renderView();

    await screen.findByTestId('messages-empty-state');
  });

  it('shows the error state when the messages cannot be fetched', async () => {
    getPersonalMessages.mockResolvedValue({ error: 'errors.databaseError', data: null });
    renderView();

    await screen.findByTestId('messages-error-state');
  });

  it('opens the selected message beside the list on wide screens', async () => {
    renderView('/messages/m1');

    const pane = await screen.findByTestId('message-pane');
    expect(pane.textContent).toContain('Data export request');
    expect(screen.getByText('Data export request', { selector: '[aria-current]' })).toBeTruthy();
    expect(screen.queryByTestId('modal')).toBeNull();
  });

  it('asks to pick a message while none is open', async () => {
    renderView();
    await screen.findAllByTestId('message-item');

    expect(screen.getByTestId('message-pane').textContent).toContain('v2.scopes.messages.select');
  });

  it('says so when the open message is not in the list', async () => {
    renderView('/messages/gone');

    await screen.findByTestId('message-not-found-state');
  });

  it('opens the selected message in a modal on narrow screens, and closes back to the list', async () => {
    isDrawerMode.mockReturnValue(true);
    renderView('/messages/m0');

    const modal = await screen.findByTestId('modal');
    await waitFor(() => expect((modal as HTMLDialogElement).open).toBe(true));
    expect(screen.queryByTestId('message-pane')).toBeNull();

    await userEvent.click(screen.getByRole('button', { name: 'close', hidden: true }));
    await waitFor(() => expect(screen.queryByText('v2.scopes.messages.notFound.title')).toBeNull());
    expect(screen.getAllByTestId('message-item')).toHaveLength(2);
  });

  it('starts with every type selected and narrows the list to the chosen types', async () => {
    getPersonalMessages.mockResolvedValue({
      data: [...messageList('Welcome'), { ...messageList('Data export request')[0], hash_id: 'r1', msg_type: 6 }],
    });
    renderView();
    const user = userEvent.setup();
    await waitFor(() => expect(screen.getAllByTestId('message-item')).toHaveLength(2));

    await user.click(screen.getByTestId('search-button'));
    const tags = screen.getAllByTestId(/^message-type-filter-tag-/).map((tag) => tag.dataset.testid);
    expect(tags).toEqual([
      'message-type-filter-tag-messages',
      'message-type-filter-tag-requests',
      'message-type-filter-tag-reports',
      'message-type-filter-tag-bugs',
    ]);

    await user.click(screen.getByTestId('message-type-filter-remove-messages'));
    await waitFor(() => expect(screen.getAllByTestId('message-item')).toHaveLength(1));
    expect(screen.getByText('Data export request')).toBeTruthy();
  });

  // Last: the search persists per list across mounts, by design.
  it('narrows the list to the search, and says so when nothing matches', async () => {
    renderView();
    const user = userEvent.setup();
    await screen.findAllByTestId('message-item');

    await user.click(screen.getByTestId('search-button'));
    await user.type(screen.getByTestId('search-field'), 'export');
    await waitFor(() => expect(screen.getAllByTestId('message-item')).toHaveLength(1));

    await user.type(screen.getByTestId('search-field'), 'xyz');
    await screen.findByTestId('messages-no-results-state');
  });
});
