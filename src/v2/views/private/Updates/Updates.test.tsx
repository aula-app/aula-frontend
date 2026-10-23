import { IdeaUpdate } from '@/v2/components/update/groupUpdates';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Updates from './Updates';

const getUpdates = vi.fn();

vi.mock('@/services/dashboard', () => ({ getUpdates: (justCount: boolean) => getUpdates(justCount) }));
vi.mock('@/store/AppStore', () => ({ useAppStore: () => [{ breadcrumb: [] }, () => {}] }));
vi.mock('@/v2/components/update/UpdateCard', () => ({
  default: ({ update }: { update: IdeaUpdate }) => (
    <div data-testid="update-card">{`${update.title}: ${update.comments} comments, ${update.votes.for} for`}</div>
  ),
}));
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, vars?: Record<string, unknown>) => (vars ? `${key}:${JSON.stringify(vars)}` : key),
  }),
}));

const updateList = (...titles: string[]) =>
  titles.map((title, i) => ({
    id: `${i}`,
    idea_id: `i${i}`,
    room_id: '1',
    topic_id: null,
    phase_id: null,
    title,
    vote_value: 1,
  }));

const renderView = () =>
  render(
    <MemoryRouter>
      <Updates />
    </MemoryRouter>
  );

beforeEach(() => {
  getUpdates.mockReset().mockResolvedValue({
    data: { votes: updateList('Longer breaks', 'New bike racks'), comments: updateList('Longer breaks') },
    count: 3,
  });
});

describe('Updates', () => {
  it('shows one card per idea, fetching the full list rather than the count', async () => {
    renderView();

    await waitFor(() => expect(screen.getAllByTestId('update-item')).toHaveLength(2));
    expect(screen.getByText('Longer breaks: 1 comments, 1 for')).toBeInTheDocument();
    expect(screen.getByText('New bike racks: 0 comments, 1 for')).toBeInTheDocument();
    expect(getUpdates).toHaveBeenCalledWith(false);
  });

  it('counts the votes and comments in the heading, and the ideas they are on', async () => {
    renderView();
    await screen.findAllByTestId('update-item');

    expect(screen.getByTestId('scope-title')).toHaveTextContent('3');
    expect(screen.getByTestId('scope-title')).toHaveTextContent('v2.scopes.updates.onIdeas:{"count":2}');
  });

  it('shows the empty state when there is nothing new', async () => {
    getUpdates.mockResolvedValue({ data: false, count: 0, error_code: 2 });
    renderView();

    expect(await screen.findByTestId('updates-empty-state')).toBeInTheDocument();
  });

  it('shows the error state when the request fails', async () => {
    getUpdates.mockResolvedValue({ data: null, error: 'boom', error_code: 1 });
    renderView();

    expect(await screen.findByTestId('updates-error-state')).toBeInTheDocument();
  });

  it('filters by idea title', async () => {
    renderView();
    await screen.findAllByTestId('update-item');

    await userEvent.click(screen.getByRole('button', { name: 'v2.ui.actions.search' }));
    await userEvent.type(screen.getByRole('searchbox'), 'bike');

    expect(screen.getAllByTestId('update-item')).toHaveLength(1);
    expect(screen.getByText('New bike racks: 0 comments, 1 for')).toBeInTheDocument();
  });
});
