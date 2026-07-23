import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ScopeTitle from './ScopeTitle';

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

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

  it('toggles the controls and focuses the first control when opened', () => {
    const onToggle = vi.fn();
    const { getByRole, getByLabelText } = render(
      <ScopeTitle scope="ideas" onToggle={onToggle}>
        <input aria-label="query" />
      </ScopeTitle>
    );

    const toggle = getByRole('button', { name: 'v2.ui.actions.search' });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');

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
