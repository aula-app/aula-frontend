import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BoxType, IdeaType } from '@/types/Scopes';
import BoxForm from './BoxForm';

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
vi.mock('@/v2/components/input/RichEditor', () => ({ default: () => <div data-testid="rich-editor" /> }));

const roomIdeas = [
  { hash_id: 'i1', title: 'Longer lunch break' },
  { hash_id: 'i2', title: 'Skate ramp' },
] as IdeaType[];

vi.mock('@/services/ideas', () => ({
  getIdeasByRoom: vi.fn(async () => ({ data: roomIdeas, error: null })),
  getIdeasByBox: vi.fn(async () => ({ data: [roomIdeas[0]], error: null })),
}));

// The API sends `phase_id` as a JSON number even though `BoxType` declares it as a string.
const box = {
  hash_id: 'box-1',
  name: 'Existing box',
  description_public: '',
  room_hash_id: 'room-1',
  phase_id: 20 as unknown as BoxType['phase_id'],
} as BoxType;

const noop = async () => true;

describe('BoxForm', () => {
  it('pre-populates the phase select from an existing box', async () => {
    const { getByTestId } = render(
      <BoxForm defaultValues={box} contextRoomId="room-1" onSubmit={noop} onCancel={() => {}} />
    );

    await screen.findByTestId('box-form-ideas-list');
    expect(getByTestId('box-form-phase').textContent).toContain('phases.approval');
  });

  it('lists the ideas the box already holds', async () => {
    render(<BoxForm defaultValues={box} contextRoomId="room-1" onSubmit={noop} onCancel={() => {}} />);

    expect(await screen.findByTestId('box-form-ideas-remove-i1')).toBeInTheDocument();
  });

  it('submits added ideas for a new box', async () => {
    const onSubmit = vi.fn(async (_data: any) => true);
    render(<BoxForm contextRoomId="room-1" onSubmit={onSubmit} onCancel={() => {}} />);

    fireEvent.change(screen.getByTestId('box-form-name'), { target: { value: 'New box' } });
    fireEvent.focus(screen.getByTestId('box-form-ideas'));
    fireEvent.mouseDown(await screen.findByTestId('box-form-ideas-option-i2'));
    fireEvent.click(screen.getByTestId('box-form-submit'));

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][0]).toMatchObject({ ideas: { add: ['i2'], remove: [] } });
  });

  it('submits ideas dropped from an existing box as removals', async () => {
    const onSubmit = vi.fn(async (_data: any) => true);
    render(<BoxForm defaultValues={box} contextRoomId="room-1" onSubmit={onSubmit} onCancel={() => {}} />);

    fireEvent.click(await screen.findByTestId('box-form-ideas-remove-i1'));
    fireEvent.click(screen.getByTestId('box-form-submit'));

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][0]).toMatchObject({ ideas: { add: [], remove: ['i1'] } });
  });
});
