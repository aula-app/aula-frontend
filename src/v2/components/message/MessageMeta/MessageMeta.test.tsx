import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import MessageMeta from './MessageMeta';

const renderMeta = (entries: [string, React.ReactNode][]) =>
  render(
    <MemoryRouter>
      <MessageMeta entries={entries} />
    </MemoryRouter>
  );

describe('MessageMeta', () => {
  it('links app paths and leaves other text as it is', () => {
    renderMeta([
      ['location', '/messages'],
      ['userAgent', 'Mozilla/5.0 (X11; Linux): Gecko'],
    ]);

    expect(screen.getByRole('link', { name: '/messages' }).getAttribute('href')).toBe('/messages');
    expect(screen.getByText('Mozilla/5.0 (X11; Linux): Gecko')).toBeTruthy();
  });

  it('renders element values, such as a formatted date, unchanged', () => {
    renderMeta([['date', <time key="d">12 June</time>]]);

    const row = screen.getByRole('term').parentElement!;
    expect(within(row).getByText('12 June').tagName).toBe('TIME');
  });

  it('renders nothing without entries', () => {
    const { container } = renderMeta([]);
    expect(container.innerHTML).toBe('');
  });
});
