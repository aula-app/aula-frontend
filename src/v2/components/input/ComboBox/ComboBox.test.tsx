import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import ComboBox from './ComboBox';
import { SelectOption } from '@/v2/components/input/SelectInput';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, vars?: Record<string, unknown>) => (vars ? `${key}:${JSON.stringify(vars)}` : key),
  }),
}));

const options: SelectOption[] = [
  { value: 'a', label: 'Longer lunch break' },
  { value: 'b', label: 'Skate ramp' },
  { value: 'c', label: 'Bike racks' },
];

const Harness = ({ initial = [], onChange }: { initial?: string[]; onChange?: (value: string[]) => void }) => {
  const [value, setValue] = useState<string[]>(initial);
  return (
    <ComboBox
      label="Ideas"
      placeholder="Select ideas"
      tagsLabel="Selected ideas"
      options={options}
      value={value}
      onChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
      data-testid="cb"
    />
  );
};

describe('ComboBox', () => {
  it('keeps the list open after a pick, marks the option and shows it as a tag', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);

    await user.click(screen.getByTestId('cb'));
    await user.click(screen.getByTestId('cb-option-b'));

    expect(onChange).toHaveBeenLastCalledWith(['b']);
    expect(screen.getByTestId('cb')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByTestId('cb-option-b')).toHaveAttribute('aria-selected', 'true');
    expect(within(screen.getByTestId('cb-tags')).getByText('Skate ramp')).toBeInTheDocument();
    expect(screen.getByTestId('cb')).toHaveFocus();
  });

  it('filters by what is typed and clears the query on a pick', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    const input = screen.getByTestId('cb');
    await user.type(input, 'skate');
    expect(screen.queryByTestId('cb-option-a')).not.toBeInTheDocument();

    await user.click(screen.getByTestId('cb-option-b'));

    expect(input).toHaveValue('');
    expect(screen.getByTestId('cb-option-a')).toBeInTheDocument();
  });

  it('unselects a picked option when it is picked again', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness initial={['b']} onChange={onChange} />);

    await user.click(screen.getByTestId('cb'));
    await user.click(screen.getByTestId('cb-option-b'));

    expect(onChange).toHaveBeenLastCalledWith([]);
    expect(screen.queryByTestId('cb-tag-b')).not.toBeInTheDocument();
  });

  it('removes a tag with its remove button', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness initial={['a', 'b']} onChange={onChange} />);

    await user.click(screen.getByTestId('cb-remove-a'));

    expect(onChange).toHaveBeenLastCalledWith(['b']);
    expect(screen.queryByTestId('cb-tag-a')).not.toBeInTheDocument();
  });

  it('removes the focused tag with Backspace', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness initial={['a', 'b']} onChange={onChange} />);

    screen.getByTestId('cb-tag-a').focus();
    await user.keyboard('{Backspace}');

    expect(onChange).toHaveBeenLastCalledWith(['b']);
  });

  it('closes on a click outside', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByTestId('cb'));
    expect(screen.getByTestId('cb')).toHaveAttribute('aria-expanded', 'true');

    await user.click(document.body);

    expect(screen.getByTestId('cb')).toHaveAttribute('aria-expanded', 'false');
  });

  it('picks the focused option with the keyboard', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);

    await user.click(screen.getByTestId('cb'));
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');

    expect(onChange).toHaveBeenLastCalledWith(['b']);
  });
});
