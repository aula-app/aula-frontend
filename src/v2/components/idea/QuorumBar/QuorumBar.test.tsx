import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import QuorumBar from './QuorumBar';

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

describe('QuorumBar', () => {
  it('draws turnout as a percentage of eligible voters', () => {
    const { container } = render(<QuorumBar votes={3} users={12} quorum={50} color="voting" />);
    expect(container.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow')).toBe('25');
  });

  it('renders nothing when nobody is eligible to vote', () => {
    const { container } = render(<QuorumBar votes={0} users={0} quorum={50} color="voting" />);
    expect(container.firstChild).toBeNull();
  });

  it('omits the marker when no quorum is configured', () => {
    const { queryByText } = render(<QuorumBar votes={3} users={12} color="voting" />);
    expect(queryByText('6')).toBeNull();
  });

  it('shows votes cast against the number eligible to vote', () => {
    const { getByText } = render(<QuorumBar votes={3} users={12} quorum={50} color="voting" />);
    expect(getByText('3')).toBeTruthy();
    expect(getByText('12')).toBeTruthy();
  });

  it('drops the eligible total once turnout crowds it', () => {
    const { queryByText } = render(<QuorumBar votes={12} users={13} quorum={50} color="voting" />);
    expect(queryByText('12')).toBeTruthy();
    expect(queryByText('13')).toBeNull();
  });

  it('labels the marker with the votes needed to clear the quorum', () => {
    const { getByText } = render(<QuorumBar votes={3} users={12} quorum={50} color="voting" />);
    expect(getByText('6')).toBeTruthy();
  });

  it('rounds the needed votes up, since a part vote cannot clear a quorum', () => {
    // 50% of 13 is 6.5, and 6 of 13 is only 46%.
    const { getByText } = render(<QuorumBar votes={3} users={13} quorum={50} color="voting" />);
    expect(getByText('7')).toBeTruthy();
  });

  it('never overflows the track when turnout exceeds the roll', () => {
    const { container } = render(<QuorumBar votes={20} users={12} quorum={50} color="voting" />);
    expect(container.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow')).toBe('100');
  });
});
