import { fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import EmojiPicker from './EmojiPicker';

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

const open = async (getByRole: ReturnType<typeof render>['getByRole'], getByLabelText: ReturnType<typeof render>['getByLabelText']) => {
  const trigger = getByRole('button', { name: 'v2.ui.editor.emoji' });
  fireEvent.click(trigger);
  // useDropdown focuses the first item on the next animation frame.
  await waitFor(() => expect(getByLabelText('v2.ui.editor.emojis.smile')).toHaveFocus());
  return trigger;
};

describe('EmojiPicker', () => {
  it('focuses the first emoji when opened', async () => {
    const { getByRole, getByLabelText } = render(<EmojiPicker onSelect={vi.fn()} />);
    await open(getByRole, getByLabelText);
  });

  it('moves focus left/right within a row, wrapping across the list', async () => {
    const { getByRole, getByLabelText } = render(<EmojiPicker onSelect={vi.fn()} />);
    await open(getByRole, getByLabelText);

    fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
    expect(getByLabelText('v2.ui.editor.emojis.laugh')).toHaveFocus();

    fireEvent.keyDown(document.activeElement!, { key: 'ArrowLeft' });
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowLeft' });
    // From the first emoji, Left wraps to the last.
    expect(getByLabelText('v2.ui.editor.emojis.check')).toHaveFocus();
  });

  it('moves focus up/down by column, wrapping between rows', async () => {
    const { getByRole, getByLabelText } = render(<EmojiPicker onSelect={vi.fn()} />);
    await open(getByRole, getByLabelText);

    // 5-column grid: Down from column 0 lands on the second row's first emoji.
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
    expect(getByLabelText('v2.ui.editor.emojis.sparkles')).toHaveFocus();

    // Up returns to the top row, same column.
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' });
    expect(getByLabelText('v2.ui.editor.emojis.smile')).toHaveFocus();
  });

  it('jumps to first/last with Home/End', async () => {
    const { getByRole, getByLabelText } = render(<EmojiPicker onSelect={vi.fn()} />);
    await open(getByRole, getByLabelText);

    fireEvent.keyDown(document.activeElement!, { key: 'End' });
    expect(getByLabelText('v2.ui.editor.emojis.check')).toHaveFocus();

    fireEvent.keyDown(document.activeElement!, { key: 'Home' });
    expect(getByLabelText('v2.ui.editor.emojis.smile')).toHaveFocus();
  });

  it('closes and returns focus to the trigger on Tab', async () => {
    const { getByRole, getByLabelText } = render(<EmojiPicker onSelect={vi.fn()} />);
    const trigger = await open(getByRole, getByLabelText);

    fireEvent.keyDown(document.activeElement!, { key: 'Tab' });
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('calls onSelect with the chosen emoji', async () => {
    const onSelect = vi.fn();
    const { getByRole, getByLabelText } = render(<EmojiPicker onSelect={onSelect} />);
    await open(getByRole, getByLabelText);

    fireEvent.click(getByLabelText('v2.ui.editor.emojis.laugh'));
    expect(onSelect).toHaveBeenCalledWith('😂');
  });
});
