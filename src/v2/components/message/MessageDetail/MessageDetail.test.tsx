import { MessageType } from '@/types/Scopes';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import MessageDetail from './MessageDetail';

const checkPermissions = vi.fn();
const archiveMessage = vi.fn();

vi.mock('@/utils', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  checkPermissions: (...args: unknown[]) => checkPermissions(...args),
}));
vi.mock('@/v2/components/message/archiveMessage', () => ({ archiveMessage: (id: string) => archiveMessage(id) }));
vi.mock('@/store', () => ({ useAppStore: () => [{}, () => {}] }));
vi.mock('@/v2/components/ui/Markdown', () => ({ default: ({ children }: { children: string }) => <p>{children}</p> }));
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }) }));

const message = (msg_type: number, body: string) =>
  ({ hash_id: 'm1', headline: 'Headline', msg_type, body, created: '2026-06-12 15:30:00', status: 1 }) as MessageType;

const deletionBody = `
---
type: deleteAccount
id: u1
realname: aula
email: aula@aula.test
---
A data deletion procedure was requested for user aula`;

const renderDetail = (msg: MessageType, onClose?: () => void, onDone?: () => void) =>
  render(
    <MemoryRouter>
      <MessageDetail message={msg} onClose={onClose} onDone={onDone} />
    </MemoryRouter>
  );

beforeEach(() => {
  checkPermissions.mockReset().mockReturnValue(true);
  archiveMessage.mockReset().mockResolvedValue({ error: null });
});

describe('MessageDetail', () => {
  it('shows a plain message as its date and content, without a details box', () => {
    renderDetail(message(1, 'Hello class'));

    expect(screen.getByTestId('message-detail-messages')).toBeTruthy();
    expect(screen.getByText('Hello class')).toBeTruthy();
    expect(screen.queryByRole('definition')).toBeNull();
  });

  it('lists the request fields, hiding internal ones, and offers to resolve it', () => {
    renderDetail(message(6, deletionBody));

    const terms = screen.getAllByRole('term').map((term) => term.textContent);
    expect(terms).toEqual(['v2.scopes.messages.date:', 'realname:', 'email:']);
    expect(screen.getByText('A data deletion procedure was requested for user aula')).toBeTruthy();
    expect(screen.getByTestId('confirm-request')).toBeTruthy();
    expect(screen.getByTestId('cancel-request')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'v2.ui.button.archive' })).toBeNull();
  });

  it('offers no actions on a reply to a request', () => {
    renderDetail(message(6, deletionBody.replace('type:', 'responseTo:')));

    expect(screen.queryByTestId('confirm-request')).toBeNull();
    expect(screen.getByRole('button', { name: 'v2.ui.button.archive' })).toBeTruthy();
  });

  it('offers no actions to users who cannot resolve requests', () => {
    checkPermissions.mockReturnValue(false);
    renderDetail(message(6, deletionBody));

    expect(screen.queryByTestId('confirm-request')).toBeNull();
    expect(screen.queryByRole('button', { name: 'v2.ui.button.archive' })).toBeNull();
  });

  it('links a report to the reported location', () => {
    renderDetail(message(4, '---\nclaim: Misinformation\nlocation: /room/r1/phase/0\n---\nFlagged'));

    expect(screen.getByTestId('message-detail-reports')).toBeTruthy();
    expect(screen.getByRole('link', { name: '/room/r1/phase/0' }).getAttribute('href')).toBe('/room/r1/phase/0');
    expect(screen.getByText('Misinformation')).toBeTruthy();
  });

  it('shows the versions of a bug report like the About page, one row per component', () => {
    const versions =
      '{"aula-backend.v1":{"aula-backend":{"running":"local"}},"aula-backend.v2":{"aula-backend":{"running":"local"}},"aula-frontend":"2.0.0"}';
    renderDetail(message(5, `---\nlocation: /messages\nversions: ${versions}\n---\nBroken`));

    const rows = screen.getAllByRole('term').map((term) => `${term.textContent} ${term.nextSibling?.textContent}`);
    expect(rows).toEqual([
      'location: /messages',
      'aula-frontend: 2.0.0',
      'aula-backend.v1: local',
      'aula-backend.v2: local',
    ]);
  });

  it('closes through its own button when shown on its own', async () => {
    const onClose = vi.fn();
    renderDetail(message(5, 'Broken'), onClose);

    await userEvent.click(screen.getByRole('button', { name: 'ui.common.dismiss' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('archives through an explicit button after the content', async () => {
    const onDone = vi.fn();
    renderDetail(message(1, 'Hello class'), undefined, onDone);

    const archive = screen.getByRole('button', { name: 'v2.ui.button.archive' });
    expect(archive.closest('header')).toBeNull();
    await userEvent.click(archive);

    expect(archiveMessage).toHaveBeenCalledWith('m1');
    expect(onDone).toHaveBeenCalled();
  });
});
