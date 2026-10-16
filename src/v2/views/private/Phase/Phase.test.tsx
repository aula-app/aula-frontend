import { IdeaType } from '@/types/Scopes';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Phase from './Phase';

const getWildIdeasByUser = vi.fn();
const getUserIdeasByPhase = vi.fn();
const useIdeaVotes = vi.fn<(...args: unknown[]) => object>(() => ({}));

vi.mock('@/services/dashboard', () => ({ getWildIdeasByUser: () => getWildIdeasByUser() }));
vi.mock('@/services/ideas', () => ({ getUserIdeasByPhase: (phase: number) => getUserIdeasByPhase(phase) }));
vi.mock('@/store/AppStore', () => ({ useAppStore: () => [{ breadcrumb: [] }, () => {}] }));
vi.mock('@/v2/hooks/useQuorum', () => ({ useQuorum: () => 0 }));
vi.mock('@/v2/hooks/useIdeaVotes', () => ({ useIdeaVotes: (...args: unknown[]) => useIdeaVotes(...args) }));
vi.mock('@/v2/components/dashboard/Dashboard', () => ({ default: () => <div data-testid="dashboard" /> }));
vi.mock('@/v2/components/idea/Idea', () => ({
  default: ({ idea }: { idea: IdeaType }) => <div data-testid="idea-card">{idea.title}</div>,
}));
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, vars?: Record<string, unknown>) => {
      if (vars && 'defaultValue' in vars) return String(vars.var);
      return vars ? `${key}:${JSON.stringify(vars)}` : key;
    },
  }),
}));

const ideaList = (...titles: string[]) =>
  titles.map((title, i) => ({ hash_id: `i${i}`, room_hash_id: 'r0', title, content: '' }) as IdeaType);

const renderView = (phase: string) =>
  render(
    <MemoryRouter initialEntries={[`/phase/${phase}`]}>
      <Routes>
        <Route path="phase/:phase" element={<Phase />} />
        <Route path="404" element={<div data-testid="not-found" />} />
      </Routes>
    </MemoryRouter>
  );

beforeEach(() => {
  getWildIdeasByUser.mockReset().mockResolvedValue({ data: ideaList('Pausenhof', 'Mensa') });
  getUserIdeasByPhase.mockReset().mockResolvedValue({ data: ideaList('Fahrradständer') });
  useIdeaVotes.mockClear();
});

describe('Phase', () => {
  it('lists the user wild ideas under the dashboard', async () => {
    renderView('0');

    await waitFor(() => expect(screen.getAllByTestId('phase-idea-item')).toHaveLength(2));
    expect(screen.getByTestId('dashboard')).toBeTruthy();
    expect(getUserIdeasByPhase).not.toHaveBeenCalled();
  });

  it('fetches the user ideas of a box phase by its number', async () => {
    renderView('30');

    await screen.findByText('Fahrradständer');
    expect(getUserIdeasByPhase).toHaveBeenCalledWith(30);
    expect(getWildIdeasByUser).not.toHaveBeenCalled();
    expect(useIdeaVotes).toHaveBeenLastCalledWith(expect.any(Array), true);
  });

  it('redirects an unknown phase to not found', async () => {
    renderView('15');

    await screen.findByTestId('not-found');
    expect(getUserIdeasByPhase).not.toHaveBeenCalled();
  });

  it('shows the empty state when the user has no ideas in the phase', async () => {
    getUserIdeasByPhase.mockResolvedValue({ error_code: 2, data: false });
    renderView('10');

    await screen.findByTestId('phase-ideas-empty-state');
  });

  it('shows the error state when the ideas cannot be fetched', async () => {
    getUserIdeasByPhase.mockResolvedValue({ error_code: 1, data: false });
    renderView('10');

    await screen.findByTestId('phase-ideas-error-state');
  });

  it('shows the error state when the response is an error without a code', async () => {
    getUserIdeasByPhase.mockResolvedValue({ error: 'errors.databaseError', data: null });
    renderView('20');

    await screen.findByTestId('phase-ideas-error-state');
  });

  it('shows the error state when the request itself throws', async () => {
    getWildIdeasByUser.mockRejectedValue(new Error('offline'));
    renderView('0');

    await screen.findByTestId('phase-ideas-error-state');
  });

  it('narrows the list to the search, and says so when nothing matches', async () => {
    renderView('0');
    const user = userEvent.setup();
    await screen.findAllByTestId('phase-idea-item');

    await user.click(screen.getByTestId('search-button'));
    await user.type(screen.getByTestId('search-field'), 'Mensa');
    await waitFor(() => expect(screen.getAllByTestId('phase-idea-item')).toHaveLength(1));

    await user.type(screen.getByTestId('search-field'), 'xyz');
    await screen.findByTestId('phase-ideas-no-results-state');
  });
});
