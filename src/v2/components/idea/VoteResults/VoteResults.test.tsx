import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import VoteResults from './VoteResults';
import { VoteResultsState } from './useVoteResults';

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

const results = (overrides: Partial<VoteResultsState> = {}): VoteResultsState => ({
  counts: { against: 1, neutral: 2, for: 3 },
  total: 6,
  voters: 12,
  ...overrides,
});

const share = (count: number) => `${(count / 12) * 100}%`;

const segments = (container: HTMLElement) => Array.from(container.querySelectorAll('[role="group"] > span'));

describe('VoteResults', () => {
  it('splits the track between the options and the voters who never turned up', () => {
    const { container } = render(<VoteResults results={results()} />);
    expect(segments(container).map((span) => (span as HTMLElement).style.width)).toEqual([
      '25%',
      share(2),
      share(1),
      '50%',
    ]);
  });

  it('paints each option in its own tone, with the non-voters grey', () => {
    const { container } = render(<VoteResults results={results()} />);
    expect(segments(container).map((span) => span.className.match(/bg-[a-z]+/)?.[0])).toEqual([
      'bg-success',
      'bg-warning',
      'bg-error',
      'bg-neutral',
    ]);
  });

  it('counts everyone who did not vote, not just those who abstained', () => {
    const { container } = render(<VoteResults results={results()} />);
    expect(segments(container)[3].textContent).toContain('6');
  });

  it('falls back to the room count when the stats carry no electorate', () => {
    const { container } = render(<VoteResults results={results({ voters: 0 })} users={12} />);
    expect((segments(container)[3] as HTMLElement).style.width).toBe('50%');
  });

  it('drops an option nobody chose rather than drawing an empty slice of it', () => {
    const { container } = render(<VoteResults results={results({ counts: { against: 0, neutral: 2, for: 3 } })} />);
    expect(segments(container).map((span) => span.className.match(/bg-[a-z]+/)?.[0])).toEqual([
      'bg-success',
      'bg-warning',
      'bg-neutral',
    ]);
  });

  it('leaves out the non-voters when weighted votes outrun the roll', () => {
    const { container } = render(<VoteResults results={results({ total: 20, voters: 12 })} />);
    expect(segments(container)).toHaveLength(3);
  });

  it('draws nothing until the counts are in', () => {
    const { container } = render(<VoteResults results={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('draws nothing when nobody was eligible to vote', () => {
    const { container } = render(<VoteResults results={results({ total: 0, voters: 0 })} />);
    expect(container.firstChild).toBeNull();
  });
});
