import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MessagesChip, UpdatesChip } from './SidebarChips';

const counts = { messages: undefined as number | undefined, updates: undefined as number | undefined };

vi.mock('@/v2/hooks/useActivityCounts', () => ({
  useMessageCount: () => counts.messages,
  useUpdateCount: () => counts.updates,
}));

beforeEach(() => {
  counts.messages = 4;
  counts.updates = 0;
});

describe('SidebarChips', () => {
  it('shows the count as a chip and reads it out after the link name', () => {
    const { container } = render(<MessagesChip />);

    expect(screen.getByTestId('badge').textContent).toBe('4');
    expect(screen.getByTestId('badge').getAttribute('aria-hidden')).toBe('true');
    expect(container.querySelector('.sr-only')?.textContent).toBe(', 4');
  });

  it('shows nothing when there is nothing to count, or the count is unknown', () => {
    const { container } = render(<UpdatesChip />);
    expect(container.innerHTML).toBe('');

    counts.messages = undefined;
    const unknown = render(<MessagesChip />);
    expect(unknown.container.innerHTML).toBe('');
  });
});
