import { IdeaType } from '@/types/Scopes';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import IdeaField from './IdeaField';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, vars?: Record<string, unknown>) => (vars ? `${key}:${JSON.stringify(vars)}` : key),
  }),
}));

const roomIdeas = [
  { hash_id: 'i1', title: 'Longer lunch break' },
  { hash_id: 'i2', title: 'Skate ramp' },
] as IdeaType[];

vi.mock('@/services/ideas', () => ({
  getIdeasByRoom: vi.fn(async () => ({ data: roomIdeas, error: null })),
}));

const renderField = (value: { value: string; label: string }[] = []) => {
  const onChange = vi.fn();
  const view = render(<IdeaField roomId="r1" value={value} onChange={onChange} />);
  return { ...view, onChange, user: userEvent.setup() };
};

const readyInput = async () => {
  const input = await screen.findByTestId('idea-field');
  await waitFor(() => expect(input).toBeEnabled());
  return input;
};

describe('IdeaField', () => {
  it('offers the room ideas and adds the picked one', async () => {
    const { onChange, user } = renderField();

    await user.click(await readyInput());
    await user.click(await screen.findByTestId('idea-field-option-i2'));

    expect(onChange).toHaveBeenCalledWith([{ value: 'i2', label: 'Skate ramp' }]);
  });

  it('filters the options by what is typed', async () => {
    const { user } = renderField();

    await user.type(await readyInput(), 'skate');

    await waitFor(() => expect(screen.getByTestId('idea-field-option-i2')).toBeInTheDocument());
    expect(screen.queryByTestId('idea-field-option-i1')).not.toBeInTheDocument();
  });

  it('marks ideas that are already selected', async () => {
    const { user } = renderField([{ value: 'i1', label: 'Longer lunch break' }]);

    await user.click(await readyInput());

    expect(await screen.findByTestId('idea-field-option-i1')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByTestId('idea-field-option-i2')).toHaveAttribute('aria-selected', 'false');
  });

  it('offers a removed idea again, even one the room does not list', async () => {
    const assigned = { value: 'i9', label: 'Already in the box' };
    const { rerender, onChange, user } = renderField([assigned]);

    await user.click(await screen.findByTestId('idea-field-remove-i9'));
    expect(onChange).toHaveBeenCalledWith([]);

    rerender(<IdeaField roomId="r1" value={[]} onChange={onChange} />);
    await user.click(await readyInput());
    await user.click(await screen.findByTestId('idea-field-option-i9'));
    expect(onChange).toHaveBeenLastCalledWith([assigned]);
  });

  it('drops an idea from the selection when its remove button is pressed', async () => {
    const selection = [
      { value: 'i1', label: 'Longer lunch break' },
      { value: 'i2', label: 'Skate ramp' },
    ];
    const { onChange, user } = renderField(selection);

    await user.click(await screen.findByTestId('idea-field-remove-i1'));

    expect(onChange).toHaveBeenCalledWith([{ value: 'i2', label: 'Skate ramp' }]);
  });
});
