import { BoxType, IdeaType } from '@/types/Scopes';
import { render } from '@testing-library/react';
import { ComponentProps } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import BoxCard from './BoxCard';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, vars?: Record<string, unknown>) => (vars ? `${key}:${JSON.stringify(vars)}` : key),
  }),
}));
vi.mock('@/utils', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/utils')>()),
  checkPermissions: () => true,
}));
vi.mock('@/v2/components/ui/MoreOptions', () => ({ default: () => null }));
vi.mock('@/v2/components/ui/Markdown', () => ({ default: () => null }));

const boxAt = (phase_id: number) =>
  ({
    hash_id: 'b1',
    name: 'A box',
    description_public: '',
    room_hash_id: 'r1',
    ideas_num: 5,
    created: '2026-01-01',
    phase_start: '2026-01-01',
    phase_id,
  }) as unknown as BoxType;

const renderCard = (phase_id: number, props: Partial<ComponentProps<typeof BoxCard>> = {}) =>
  render(
    <MemoryRouter>
      <BoxCard box={boxAt(phase_id)} {...props} />
    </MemoryRouter>
  );

const bar = (container: HTMLElement) => container.querySelector('[role="progressbar"]');
const rows = (container: HTMLElement) => Array.from(container.querySelectorAll('[data-testid="box-idea-list"] li'));

const ideaList = (approvals: number[], likes: number[] = [], winners: number[] = [], comments: number[] = []) =>
  approvals.map((approved, i) => ({
    hash_id: `i${i}`,
    title: `Idea ${i}`,
    approved,
    sum_likes: likes[i] ?? 0,
    sum_comments: comments[i] ?? 0,
    is_winner: winners[i] ?? 0,
  })) as IdeaType[];

describe('BoxCard idea preview', () => {
  it('previews the first few idea titles', () => {
    const { container } = renderCard(20, { ideas: ideaList([1, -1, 0]) });

    expect(rows(container).map((li) => li.textContent)).toEqual([
      expect.stringContaining('Idea 0'),
      expect.stringContaining('Idea 1'),
      expect.stringContaining('Idea 2'),
    ]);
  });

  it('keeps every idea past the third, for the list to scroll to', () => {
    const { container } = renderCard(20, { ideas: ideaList([1, -1, 0, 0, 0]) });

    expect(rows(container)).toHaveLength(5);
    expect(rows(container)[4].textContent).toContain('Idea 4');
  });

  it('draws nothing for a caller that does not pass ideas, such as the box view', () => {
    const { container } = renderCard(20);

    expect(container.querySelector('[data-testid="box-idea-list"]')).toBeNull();
  });

  it('shows each idea approval status, with phase_id arriving as a number as the API sends it', () => {
    const { container } = renderCard(20, { ideas: ideaList([1, -1, 0]) });

    const labels = rows(container).map((li) => li.querySelector('[aria-label]')?.getAttribute('aria-label'));
    expect(labels).toEqual([
      'v2.scopes.ideas.status.approved',
      'v2.scopes.ideas.status.rejected',
      'v2.scopes.ideas.status.waiting',
    ]);
  });

  it('falls back to the phase icon when an idea has no category', () => {
    const { container } = renderCard(20, { ideas: ideaList([0]) });

    const slot = rows(container)[0].firstElementChild;
    expect(slot?.querySelector('svg')).toBeTruthy();
    expect(slot?.textContent).toBe('');
  });

  it('shows the category label in place of the phase icon when there is one', () => {
    const { container } = renderCard(20, {
      ideas: ideaList([0]),
      categories: { i0: { id: 'c1', label: 'Umwelt' } },
    });

    const slot = rows(container)[0].firstElementChild;
    expect(slot?.textContent).toBe('Umwelt');
    expect(slot?.querySelector('svg')).toBeNull();
  });

  it('shows the status as an icon only, still labelled for screen readers', () => {
    const { container } = renderCard(20, { ideas: ideaList([1]) });

    const badge = rows(container)[0].querySelector('[aria-label="v2.scopes.ideas.status.approved"]');
    expect(badge?.querySelector('svg')).toBeTruthy();
    expect(badge?.textContent).toBe('');
  });

  it('paints the row in its status color so the strip reads at a glance', () => {
    const { container } = renderCard(20, { ideas: ideaList([1, -1]) });

    const title = (i: number) => rows(container)[i].querySelector('a')?.className;
    expect(title(0)).toContain('bg-success');
    expect(title(1)).toContain('bg-error');
  });

  it('keeps the box color on the category chip, but not on the icon fallback', () => {
    const withCategory = renderCard(20, {
      ideas: ideaList([1]),
      categories: { i0: { id: 'c1', label: 'Umwelt' } },
    });
    const withIcon = renderCard(20, { ideas: ideaList([1]) });

    expect(rows(withCategory.container)[0].firstElementChild?.className).toContain('bg-approval-light');
    expect(rows(withIcon.container)[0].firstElementChild?.className).toContain('bg-success');
  });

  it('shows the comment and like counts in discussion, where there is no status to report', () => {
    const { container } = renderCard(10, { ideas: ideaList([0, 0], [12, 1], [], [5, 1]) });

    const badge = (i: number) => rows(container)[i].lastElementChild;
    const labels = (i: number) =>
      Array.from(badge(i)?.querySelectorAll('.sr-only') ?? []).map((node) => node.textContent);

    expect(badge(0)?.textContent).toContain('5');
    expect(badge(0)?.textContent).toContain('12');
    expect(labels(0)).toEqual([expect.stringContaining('stats.comments'), expect.stringContaining('stats.likes')]);
    expect(labels(1)).toEqual([expect.stringContaining('stats.comment:'), expect.stringContaining('stats.like:')]);
  });

  it('keeps the status badge in approval rather than the like count', () => {
    const { container } = renderCard(20, { ideas: ideaList([1], [9]) });

    const badge = rows(container)[0].lastElementChild;
    expect(badge?.getAttribute('aria-label')).toBe('v2.scopes.ideas.status.approved');
    expect(badge?.textContent).not.toContain('9');
  });

  it("shows the viewer's own vote on each row during voting", () => {
    const { container } = renderCard(30, {
      ideas: ideaList([1, 1, 1]),
      votes: { i0: 1, i1: -1, i2: 0 },
    });

    const labels = rows(container).map((li) => li.querySelector('[aria-label]')?.getAttribute('aria-label'));
    expect(labels).toEqual([
      'v2.scopes.ideas.status.votedFor',
      'v2.scopes.ideas.status.votedAgainst',
      'v2.scopes.ideas.status.votedNeutral',
    ]);
  });

  it('reads an idea the viewer has not voted on as waiting', () => {
    const { container } = renderCard(30, { ideas: ideaList([1]), votes: {} });

    expect(rows(container)[0].querySelector('[aria-label]')?.getAttribute('aria-label')).toBe(
      'v2.scopes.ideas.status.waiting'
    );
  });
});

describe('BoxCard approval progress', () => {
  it('derives review progress from the ideas when given them', () => {
    const { container } = renderCard(20, { ideas: ideaList([1, -1, 0, 0, 0]) });

    expect(bar(container)?.getAttribute('aria-valuenow')).toBe('40');
  });

  it('reports how far the review has got during approval', () => {
    const { container } = renderCard(20, { progress: { settled: 3, total: 5 } });

    expect(bar(container)?.getAttribute('aria-valuenow')).toBe('60');
    expect(bar(container)?.getAttribute('aria-label')).toContain('v2.scopes.boxes.reviewed');
  });

  it('draws a full bar once every idea has been decided', () => {
    const { container } = renderCard(20, { progress: { settled: 5, total: 5 } });

    expect(bar(container)?.getAttribute('aria-valuenow')).toBe('100');
  });

  it('draws nothing when the caller cannot supply the counts', () => {
    const { container } = renderCard(20);

    expect(bar(container)).toBeNull();
  });

  it('draws nothing for an empty box, which has no review to report', () => {
    const { container } = renderCard(20, { progress: { settled: 0, total: 0 } });

    expect(bar(container)).toBeNull();
  });

  it('counts decided ideas in the results phase, where the winner flag records the answer', () => {
    const { container } = renderCard(40, { ideas: ideaList([0, 0, 0, 0, 0], [], [1, -1, 0, 0, 0]) });

    expect(bar(container)?.getAttribute('aria-valuenow')).toBe('40');
    expect(bar(container)?.getAttribute('aria-label')).toContain('v2.scopes.boxes.decided');
  });

  it('leaves the countdown alone in phases that have one', () => {
    const { container } = renderCard(10, { progress: { settled: 3, total: 5 } });

    expect(bar(container)?.getAttribute('aria-label')).toContain('phases.');
  });
});

describe('BoxCard countdown', () => {
  const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString();

  const countdownAt = (started: string, duration: number) =>
    render(
      <MemoryRouter>
        <BoxCard box={{ ...boxAt(10), phase_start: started, phase_duration_1: duration } as BoxType} />
      </MemoryRouter>
    );

  it('starts empty and grows as the phase runs down', () => {
    const fresh = countdownAt(daysAgo(0), 10);
    const midway = countdownAt(daysAgo(5), 10);

    expect(Number(bar(fresh.container)?.getAttribute('aria-valuenow'))).toBe(0);
    expect(Number(bar(midway.container)?.getAttribute('aria-valuenow'))).toBe(50);
  });

  it('reads full once the phase has run out, rather than empty', () => {
    const { container } = countdownAt(daysAgo(14), 10);

    expect(Number(bar(container)?.getAttribute('aria-valuenow'))).toBe(100);
  });
});
