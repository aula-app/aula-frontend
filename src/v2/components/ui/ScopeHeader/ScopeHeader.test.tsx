import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ScopeHeader from './ScopeHeader';

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

describe('ScopeHeader', () => {
  it('renders the title without a search button by default', () => {
    const { getByText, queryByRole } = render(<ScopeHeader title={<h1>Ideas</h1>} />);
    expect(getByText('Ideas')).toBeTruthy();
    expect(queryByRole('button')).toBeNull();
  });

  it('toggles the search field open and closed', () => {
    const { getByRole, getByLabelText } = render(<ScopeHeader title={<h1>Ideas</h1>} searchable />);

    const toggle = getByRole('button', { name: 'v2.ui.actions.search' });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');

    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(getByRole('button', { name: 'v2.ui.actions.close' })).toBe(toggle);
    expect(getByLabelText('v2.ui.actions.search')).toHaveFocus();

    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(getByRole('button', { name: 'v2.ui.actions.search' })).toBe(toggle);
  });
});
