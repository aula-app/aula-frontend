import { RoomType } from '@/types/Scopes';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Rooms from './Rooms';

const getRooms = vi.fn();

vi.mock('@/services/rooms', () => ({ getRooms: (...args: unknown[]) => getRooms(...args) }));
vi.mock('./useRoomPhaseCounts', () => ({ useRoomPhaseCounts: () => ({}) }));
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, vars?: Record<string, unknown>) => {
      if (vars && 'defaultValue' in vars) return String(vars.var);
      return vars ? `${key}:${JSON.stringify(vars)}` : key;
    },
  }),
}));

const roomList = (...names: string[]) =>
  names.map((room_name, i) => ({ hash_id: `r${i}`, room_name, description_internal: '' }) as RoomType);

const renderView = () =>
  render(
    <MemoryRouter>
      <Rooms />
    </MemoryRouter>
  );

beforeEach(() => {
  getRooms.mockReset().mockResolvedValue({ data: roomList('Klimaschutz', 'Mensa') });
});

describe('Rooms', () => {
  it('lists a card per room', async () => {
    renderView();

    await waitFor(() => expect(screen.getAllByTestId('room-card-item')).toHaveLength(2));
  });

  it('shows the empty state when the user is in no rooms', async () => {
    getRooms.mockResolvedValue({ error_code: 2, data: false });
    renderView();

    await screen.findByTestId('rooms-empty-state');
  });

  it('shows the error state when the rooms cannot be fetched', async () => {
    getRooms.mockResolvedValue({ error_code: 1, data: false });
    renderView();

    await screen.findByTestId('rooms-error-state');
  });

  it('shows the error state when the request itself throws', async () => {
    getRooms.mockRejectedValue(new Error('offline'));
    renderView();

    await screen.findByTestId('rooms-error-state');
  });

  it('narrows the list to the search, and says so when nothing matches', async () => {
    renderView();
    const user = userEvent.setup();
    await screen.findAllByTestId('room-card-item');

    await user.click(screen.getByTestId('search-button'));
    await user.type(screen.getByTestId('search-field'), 'Mensa');
    await waitFor(() => expect(screen.getAllByTestId('room-card-item')).toHaveLength(1));

    await user.type(screen.getByTestId('search-field'), 'xyz');
    await screen.findByTestId('rooms-no-results-state');
  });
});
