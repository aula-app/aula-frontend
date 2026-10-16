import { BoxType, IdeaType } from '@/types/Scopes';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Idea from './Idea';

const idea = {
  hash_id: 'i1',
  title: 'An idea',
  content: '',
} as IdeaType;

const box = { hash_id: 'b1', name: 'Existing box', phase_id: 20 } as unknown as BoxType;

let boxState: { box: BoxType | null; isLoading: boolean } = { box, isLoading: false };

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
vi.mock('./useIdea', () => ({
  useIdea: () => ({ idea, isLoading: false, error: null, refetch: async () => idea }),
}));
vi.mock('./useIdeaBox', () => ({ useIdeaBox: () => boxState }));
vi.mock('@/services/rooms', () => ({ getRoom: async () => ({ data: { room_name: 'Room' } }) }));
vi.mock('@/store/AppStore', () => ({ useAppStore: () => [{ breadcrumb: [] }, () => {}] }));
vi.mock('@/v2/hooks/useIdeaVotes', () => ({ useIdeaVotes: () => ({}) }));
vi.mock('@/v2/hooks/useQuorum', () => ({ useQuorum: () => 0 }));
vi.mock('@/v2/hooks/useRoomUsers', () => ({ useRoomUsers: () => 0 }));
vi.mock('@/v2/components/idea/Idea', () => ({ default: () => <div data-testid="idea-card" /> }));
vi.mock('./Comments', () => ({ default: () => <div data-testid="comments" /> }));

const LocationProbe = () => <span data-testid="location">{useLocation().pathname}</span>;

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <LocationProbe />
      <Routes>
        <Route path="/room/:room_id/phase/:phase/idea/:idea_id" element={<Idea />} />
        <Route path="/room/:room_id/phase/:phase/idea-box/:box_id/idea/:idea_id" element={<Idea />} />
      </Routes>
    </MemoryRouter>
  );

describe('Idea', () => {
  beforeEach(() => {
    boxState = { box, isLoading: false };
  });

  it('realigns a stale phase segment with the idea phase, keeping it in its box', async () => {
    const { getByTestId } = renderAt('/room/r1/phase/10/idea-box/b1/idea/i1');

    await waitFor(() => expect(getByTestId('location').textContent).toBe('/room/r1/phase/20/idea-box/b1/idea/i1'));
  });

  it('picks up the box even when the url has no box segment', async () => {
    const { getByTestId } = renderAt('/room/r1/phase/10/idea/i1');

    await waitFor(() => expect(getByTestId('location').textContent).toBe('/room/r1/phase/20/idea-box/b1/idea/i1'));
  });

  it('sends a wild idea back to phase 0, with no box segment', async () => {
    boxState = { box: null, isLoading: false };
    const { getByTestId } = renderAt('/room/r1/phase/20/idea-box/b1/idea/i1');

    await waitFor(() => expect(getByTestId('location').textContent).toBe('/room/r1/phase/0/idea/i1'));
  });

  it('waits for the box before touching the url', async () => {
    boxState = { box: null, isLoading: true };
    const { getByTestId } = renderAt('/room/r1/phase/20/idea-box/b1/idea/i1');

    await waitFor(() => expect(getByTestId('idea-card')).toBeTruthy());
    expect(getByTestId('location').textContent).toBe('/room/r1/phase/20/idea-box/b1/idea/i1');
  });

  it('leaves the url alone when the phase segment already matches', async () => {
    const { getByTestId } = renderAt('/room/r1/phase/20/idea-box/b1/idea/i1');

    await waitFor(() => expect(getByTestId('location').textContent).toBe('/room/r1/phase/20/idea-box/b1/idea/i1'));
  });

  it('renders the idea and its comments', async () => {
    const { getByTestId } = renderAt('/room/r1/phase/20/idea-box/b1/idea/i1');

    await waitFor(() => expect(getByTestId('idea-card')).toBeTruthy());
    expect(getByTestId('comments')).toBeTruthy();
  });
});
