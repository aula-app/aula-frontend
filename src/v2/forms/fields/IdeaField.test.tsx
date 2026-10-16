import { IdeaType } from '@/types/Scopes';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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
  return { ...view, onChange };
};

describe('IdeaField', () => {
  it('offers the room ideas and adds the picked one', async () => {
    const { onChange } = renderField();

    const input = await screen.findByTestId('idea-field');
    fireEvent.focus(input);

    await waitFor(() => expect(screen.getByTestId('idea-field-option-i2')).toBeInTheDocument());
    fireEvent.mouseDown(screen.getByTestId('idea-field-option-i2'));

    expect(onChange).toHaveBeenCalledWith([{ value: 'i2', label: 'Skate ramp' }]);
  });

  it('filters the options by what is typed', async () => {
    renderField();

    const input = await screen.findByTestId('idea-field');
    fireEvent.change(input, { target: { value: 'skate' } });

    await waitFor(() => expect(screen.getByTestId('idea-field-option-i2')).toBeInTheDocument());
    expect(screen.queryByTestId('idea-field-option-i1')).not.toBeInTheDocument();
  });

  it('leaves out ideas that are already selected', async () => {
    renderField([{ value: 'i1', label: 'Longer lunch break' }]);

    const input = await screen.findByTestId('idea-field');
    fireEvent.focus(input);

    await waitFor(() => expect(screen.getByTestId('idea-field-option-i2')).toBeInTheDocument());
    expect(screen.queryByTestId('idea-field-option-i1')).not.toBeInTheDocument();
  });

  it('offers a removed idea again, even one the room does not list', async () => {
    const assigned = { value: 'i9', label: 'Already in the box' };
    const { rerender, onChange } = renderField([assigned]);

    fireEvent.click(await screen.findByTestId('idea-field-remove-i9'));
    expect(onChange).toHaveBeenCalledWith([]);

    rerender(<IdeaField roomId="r1" value={[]} onChange={onChange} />);
    fireEvent.focus(screen.getByTestId('idea-field'));

    await waitFor(() => expect(screen.getByTestId('idea-field-option-i9')).toBeInTheDocument());
    fireEvent.mouseDown(screen.getByTestId('idea-field-option-i9'));
    expect(onChange).toHaveBeenLastCalledWith([assigned]);
  });

  it('drops an idea from the selection when its remove button is pressed', async () => {
    const selection = [
      { value: 'i1', label: 'Longer lunch break' },
      { value: 'i2', label: 'Skate ramp' },
    ];
    const { onChange } = renderField(selection);

    fireEvent.click(await screen.findByTestId('idea-field-remove-i1'));

    expect(onChange).toHaveBeenCalledWith([{ value: 'i2', label: 'Skate ramp' }]);
  });
});
