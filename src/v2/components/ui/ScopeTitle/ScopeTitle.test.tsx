import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ScopeTitle from './ScopeTitle';

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
vi.mock('../Icon/Icon', () => ({
  default: ({ type }: { type: string }) => <span data-testid={`icon-${type}`} />,
}));

describe('ScopeTitle', () => {
  it('renders the scope label and count without a toggle button by default', () => {
    const { getByText, queryByRole } = render(<ScopeTitle scope="ideas" count={2} />);
    expect(getByText('v2.scopes.ideas.plural')).toBeTruthy();
    expect(getByText('2')).toBeTruthy();
    expect(queryByRole('button')).toBeNull();
  });

  it('uses the singular label when count is 1', () => {
    const { getByText } = render(<ScopeTitle scope="ideas" count={1} />);
    expect(getByText('v2.scopes.ideas.singular')).toBeTruthy();
  });

  it('shows the scope icon when no phase is given', () => {
    const { getByTestId } = render(<ScopeTitle scope="ideas" count={2} />);
    expect(getByTestId('icon-ideas')).toBeTruthy();
  });

  it('shows the phase icon instead of the scope icon inside a phase sentence', () => {
    const { getByTestId, queryByTestId } = render(<ScopeTitle scope="ideas" count={2} phase="10" />);
    expect(getByTestId('icon-discussion')).toBeTruthy();
    expect(queryByTestId('icon-ideas')).toBeNull();
  });

  it('falls back to the scope icon for an unknown phase', () => {
    const { getByTestId } = render(<ScopeTitle scope="ideas" count={2} phase="99" />);
    expect(getByTestId('icon-ideas')).toBeTruthy();
  });

  it('toggles the controls and focuses the first control when opened', () => {
    const onToggle = vi.fn();
    const { getByRole, getByLabelText } = render(
      <ScopeTitle scope="ideas" onToggle={onToggle}>
        <input aria-label="query" />
      </ScopeTitle>
    );

    const toggle = getByRole('button', { name: 'v2.ui.actions.search' });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(toggle.getAttribute('aria-controls')).toBe(getByRole('search').id);

    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(getByRole('button', { name: 'v2.ui.actions.close' })).toBe(toggle);
    expect(getByLabelText('query')).toHaveFocus();
    expect(onToggle).toHaveBeenCalledWith(true);

    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(onToggle).toHaveBeenCalledWith(false);
  });
});
