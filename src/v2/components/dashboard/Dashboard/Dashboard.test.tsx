import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Dashboard from './Dashboard';

const getDashboard = vi.fn();
const getUpdates = vi.fn();
const getPersonalMessages = vi.fn();

vi.mock('@/services/dashboard', () => ({ getDashboard: () => getDashboard(), getUpdates: () => getUpdates() }));
vi.mock('@/services/messages', () => ({ getPersonalMessages: () => getPersonalMessages() }));
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, vars?: Record<string, unknown>) => (vars ? `${key}:${JSON.stringify(vars)}` : key),
  }),
}));

const renderDashboard = (open = true, onOpenChange = vi.fn()) =>
  render(
    <MemoryRouter>
      <Dashboard open={open} onOpenChange={onOpenChange} />
    </MemoryRouter>
  );

beforeEach(() => {
  getDashboard.mockReset().mockResolvedValue({ data: { phase_counts: { 0: 4, 10: 1, 20: 0, 30: 2, 40: 9 } } });
  getUpdates.mockReset().mockResolvedValue({ count: 15 });
  getPersonalMessages.mockReset().mockResolvedValue({ data: [{}, {}, {}] });
});

describe('Dashboard', () => {
  it('links each phase but results to its overview with the user idea count', async () => {
    renderDashboard();

    const wild = await screen.findByTestId('dashboard-phase-0');
    expect(wild.getAttribute('href')).toBe('/phase/0');
    expect(wild.textContent).toContain('4');
    expect(screen.getByTestId('dashboard-phase-30').textContent).toContain('2');
    expect(screen.queryByTestId('dashboard-phase-40')).toBeNull();
  });

  it('shows an error instead of the phases when the counts cannot be fetched', async () => {
    getDashboard.mockResolvedValue({ error: 'failed', data: null });
    renderDashboard();

    await screen.findByRole('alert');
    expect(screen.queryByTestId('dashboard-phase-0')).toBeNull();
  });

  it('requests the opposite state from the toggle and reflects the current one', async () => {
    const onOpenChange = vi.fn();
    renderDashboard(false, onOpenChange);

    const toggle = screen.getByTestId('dashboard-toggle');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    await userEvent.click(toggle);
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('links to messages and updates, announcing the new counts', async () => {
    renderDashboard();

    const messages = await screen.findByRole('link', { name: /newCount.*"count":3/ });
    expect(messages.getAttribute('href')).toBe('/messages');
    const updates = screen.getByRole('link', { name: /newCount.*"count":15/ });
    expect(updates.getAttribute('href')).toBe('/updates');
    expect(screen.getAllByTestId('badge').map((badge) => badge.textContent)).toEqual(['3', '15']);
  });

  it('keeps the activity links without a badge when there is nothing new', async () => {
    getUpdates.mockResolvedValue({ count: 0 });
    getPersonalMessages.mockRejectedValue(new Error('offline'));
    renderDashboard();

    await screen.findByTestId('dashboard-phase-0');
    expect(screen.getByRole('link', { name: 'ui.navigation.messages' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'ui.navigation.updates' })).toBeTruthy();
    expect(screen.queryAllByTestId('badge')).toHaveLength(0);
  });
});
