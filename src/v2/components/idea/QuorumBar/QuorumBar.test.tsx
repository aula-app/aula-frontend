import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import QuorumBar from './QuorumBar';

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

describe('QuorumBar', () => {
  it('draws turnout as a percentage of eligible voters', () => {
    const { container } = render(<QuorumBar metric="votes" count={3} users={12} quorum={50} color="voting" />);
    expect(container.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow')).toBe('25');
  });

  it('renders nothing when nobody is eligible to vote', () => {
    const { container } = render(<QuorumBar metric="votes" count={0} users={0} quorum={50} color="voting" />);
    expect(container.firstChild).toBeNull();
  });

  it('omits the marker when no quorum is configured', () => {
    const { queryByText } = render(<QuorumBar metric="votes" count={3} users={12} color="voting" />);
    expect(queryByText('6')).toBeNull();
  });

  it('shows votes cast against the number eligible to vote', () => {
    const { getByText } = render(<QuorumBar metric="votes" count={3} users={12} quorum={50} color="voting" />);
    expect(getByText('3')).toBeTruthy();
    expect(getByText('12')).toBeTruthy();
  });

  it('drops the eligible total once turnout crowds it', () => {
    const { queryByText } = render(<QuorumBar metric="votes" count={12} users={13} quorum={50} color="voting" />);
    expect(queryByText('12')).toBeTruthy();
    expect(queryByText('13')).toBeNull();
  });

  it('labels the marker with the votes needed to clear the quorum', () => {
    const { getByText } = render(<QuorumBar metric="votes" count={3} users={12} quorum={50} color="voting" />);
    expect(getByText('6')).toBeTruthy();
  });

  it('rounds the needed votes up, since a part vote cannot clear a quorum', () => {
    const { getByText } = render(<QuorumBar metric="votes" count={3} users={13} quorum={50} color="voting" />);
    expect(getByText('7')).toBeTruthy();
  });

  it('never overflows the track when turnout exceeds the roll', () => {
    const { container } = render(<QuorumBar metric="votes" count={20} users={12} quorum={50} color="voting" />);
    expect(container.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow')).toBe('100');
  });
});

describe('QuorumBar at zero', () => {
  it('shows no count on an idea nobody has backed', () => {
    const { container } = render(<QuorumBar metric="likes" count={0} users={12} quorum={50} color="wild" />);
    const fill = container.querySelector('[role="progressbar"]')!.firstElementChild as HTMLElement;
    expect(fill.style.width).toBe('0%');
    expect(fill.textContent).toBe('');
  });
});

describe('QuorumBar with untrustworthy API numbers', () => {
  it('renders nothing when the endpoint omits the participant count', () => {
    const { container } = render(
      <QuorumBar metric="likes" count={3} users={undefined as unknown as number} quorum={50} color="wild" />
    );
    expect(container.firstChild).toBeNull();
  });

  it('never prints NaN when counts arrive as strings', () => {
    const { container, getByText } = render(
      <QuorumBar
        metric="likes"
        count={'3' as unknown as number}
        users={'12' as unknown as number}
        quorum={50}
        color="wild"
      />
    );
    expect(container.textContent).not.toContain('NaN');
    expect(getByText('6')).toBeTruthy();
    expect(container.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow')).toBe('25');
  });
});
