import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BoxType } from '@/types/Scopes';
import BoxForm from './BoxForm';

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
vi.mock('@/v2/components/input/RichEditor', () => ({ default: () => <div data-testid="rich-editor" /> }));

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
  it('pre-populates the phase select from an existing box', () => {
    const { getByTestId } = render(
      <BoxForm defaultValues={box} contextRoomId="room-1" onSubmit={noop} onCancel={() => {}} />
    );

    expect(getByTestId('box-form-phase').textContent).toContain('phases.approval');
  });
});
