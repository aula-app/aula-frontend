import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { BoxType } from '@/types/Scopes';
import Box from './Box';

const box = {
  hash_id: 'b1',
  name: 'Existing box',
  description_public: '',
  room_hash_id: 'r1',
  phase_id: 20 as unknown as BoxType['phase_id'],
} as BoxType;

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
vi.mock('./useBox', () => ({ useBox: () => ({ box, isLoading: false, error: null, refetch: async () => box }) }));
vi.mock('./useIdeasByBox', () => ({
  useIdeasByBox: () => ({ ideas: [], isLoading: false, error: null, refetch: () => {} }),
}));
vi.mock('@/services/rooms', () => ({ getRoom: async () => ({ data: { room_name: 'Room' } }) }));
vi.mock('@/services/ideas', () => ({ addIdea: async () => ({}) }));
vi.mock('@/store/AppStore', () => ({ useAppStore: () => [{ breadcrumb: [] }, () => {}] }));
vi.mock('@/v2/hooks/useModal', () => ({ useModal: () => ({ openModal: () => {}, closeModal: () => {} }) }));
vi.mock('@/v2/components/box/BoxCard', () => ({ default: () => <div data-testid="box-card" /> }));

const LocationProbe = () => <span data-testid="location">{useLocation().pathname}</span>;

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <LocationProbe />
      <Routes>
        <Route path="/room/:room_id/phase/:phase/idea-box/:box_id" element={<Box />} />
      </Routes>
    </MemoryRouter>
  );

describe('Box', () => {
  it('realigns a stale phase segment with the box phase', async () => {
    const { getByTestId } = renderAt('/room/r1/phase/10/idea-box/b1');

    await waitFor(() => expect(getByTestId('location').textContent).toBe('/room/r1/phase/20/idea-box/b1'));
  });

  it('leaves the url alone when the phase segment already matches', async () => {
    const { getByTestId } = renderAt('/room/r1/phase/20/idea-box/b1');

    await waitFor(() => expect(getByTestId('location').textContent).toBe('/room/r1/phase/20/idea-box/b1'));
  });
});
