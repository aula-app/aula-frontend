import { MessageType } from '@/types/Scopes';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import MessageCard from './MessageCard';

const setMessageStatus = vi.fn();
const checkPermissions = vi.fn();
const dispatch = vi.fn();

vi.mock('@/services/messages', () => ({ setMessageStatus: (args: unknown) => setMessageStatus(args) }));
vi.mock('@/utils', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  checkPermissions: (...args: unknown[]) => checkPermissions(...args),
}));
vi.mock('@/store', () => ({ useAppStore: () => [{}, dispatch] }));
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }) }));

const message = (msg_type: number) =>
  ({ hash_id: 'm1', headline: 'Hate speech report', msg_type, created: '2026-06-12 15:30:00' }) as MessageType;

const renderCard = (msg_type = 1, onArchived = vi.fn()) =>
  render(
    <MemoryRouter>
      <MessageCard message={message(msg_type)} onArchived={onArchived} />
    </MemoryRouter>
  );

beforeEach(() => {
  setMessageStatus.mockReset().mockResolvedValue({ error: null });
  checkPermissions.mockReset().mockReturnValue(true);
  dispatch.mockReset();
});

describe('MessageCard', () => {
  it.each([
    [1, 'messages'],
    [4, 'reports'],
    [5, 'bugs'],
    [6, 'requests'],
  ])('styles msg_type %i as %s and links to its detail', (msgType, variant) => {
    renderCard(msgType);

    expect(screen.getByTestId(`message-${variant}-m1`)).toBeTruthy();
    expect(screen.getByRole('link').getAttribute('href')).toBe('/messages/m1');
  });

  it('names the article after the headline and shows when it was sent', () => {
    const { container } = renderCard();

    expect(screen.getByRole('article', { name: 'Hate speech report' })).toBeTruthy();
    const time = container.querySelector('time');
    expect(time?.getAttribute('dateTime')).toBe('2026-06-12 15:30:00');
    expect(time?.textContent).toMatch(/2026/);
  });

  it('archives the message and notifies the list', async () => {
    const onArchived = vi.fn();
    renderCard(4, onArchived);

    await userEvent.click(screen.getByRole('button', { name: 'v2.ui.button.archive: Hate speech report' }));

    expect(setMessageStatus).toHaveBeenCalledWith({ message_id: 'm1', status: 3 });
    expect(onArchived).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.objectContaining({ type: 'success' }) })
    );
  });

  it('keeps the message and shows the error when archiving fails', async () => {
    setMessageStatus.mockResolvedValue({ error: 'nope' });
    const onArchived = vi.fn();
    renderCard(1, onArchived);

    await userEvent.click(screen.getByRole('button'));

    expect(onArchived).not.toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ message: { message: 'nope', type: 'error' } }));
  });

  it('hides the archive action on a request still waiting for a decision', () => {
    render(
      <MemoryRouter>
        <MessageCard message={{ ...message(6), body: '---\ntype: deleteAccount\nid: u1\n---\nDelete me' }} />
      </MemoryRouter>
    );

    expect(screen.queryByRole('button')).toBeNull();
  });

  it('hides the archive action from users who cannot change message status', () => {
    checkPermissions.mockReturnValue(false);
    renderCard();

    expect(screen.queryByRole('button')).toBeNull();
  });
});
