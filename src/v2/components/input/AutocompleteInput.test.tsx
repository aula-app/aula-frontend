import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import AutocompleteInput from './AutocompleteInput';
import { SelectOption } from './SelectInput';

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

const Harness = ({ onSelect }: { onSelect?: (value: string) => void }) => {
  const [picked, setPicked] = useState<string[]>([]);
  return (
    <AutocompleteInput
      label="Add idea"
      options={options.filter((option) => !picked.includes(option.value))}
      onSelect={(value) => {
        setPicked((current) => [...current, value]);
        onSelect?.(value);
      }}
      data-testid="ac"
    />
  );
};

describe('AutocompleteInput', () => {
  it('keeps the list open after a pick and drops the picked option', () => {
    const onSelect = vi.fn();
    render(<Harness onSelect={onSelect} />);

    fireEvent.focus(screen.getByTestId('ac'));
    fireEvent.mouseDown(screen.getByTestId('ac-option-b'));

    expect(onSelect).toHaveBeenCalledWith('b');
    expect(screen.getByTestId('ac')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.queryByTestId('ac-option-b')).not.toBeInTheDocument();
    expect(screen.getByTestId('ac-option-a')).toBeInTheDocument();
    expect(screen.getByTestId('ac')).toHaveFocus();
  });

  it('clears the query on a pick so the rest of the list is visible again', () => {
    render(<Harness />);

    const input = screen.getByTestId('ac');
    fireEvent.change(input, { target: { value: 'skate' } });
    expect(screen.queryByTestId('ac-option-a')).not.toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId('ac-option-b'));

    expect(input).toHaveValue('');
    expect(screen.getByTestId('ac-option-a')).toBeInTheDocument();
  });

  it('closes once every option is picked', () => {
    render(<Harness />);

    fireEvent.focus(screen.getByTestId('ac'));
    options.forEach((option) => fireEvent.mouseDown(screen.getByTestId(`ac-option-${option.value}`)));

    expect(screen.queryByTestId('ac-option-a')).not.toBeInTheDocument();
    expect(screen.getByTestId('ac')).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByTestId('ac')).toBeDisabled();
  });

  it('closes on a click outside', () => {
    render(<Harness />);

    fireEvent.focus(screen.getByTestId('ac'));
    expect(screen.getByTestId('ac')).toHaveAttribute('aria-expanded', 'true');

    fireEvent.mouseDown(document.body);

    expect(screen.getByTestId('ac')).toHaveAttribute('aria-expanded', 'false');
  });

  it('picks the focused option with the keyboard', () => {
    const onSelect = vi.fn();
    render(<Harness onSelect={onSelect} />);

    const input = screen.getByTestId('ac');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onSelect).toHaveBeenCalledWith('b');
  });
});
