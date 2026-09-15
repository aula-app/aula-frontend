import { IdeaType } from '@/types/Scopes';
import { render } from '@testing-library/react';
import { ComponentProps } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import Idea from './Idea';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));
vi.mock('@/utils', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/utils')>()),
  checkPermissions: () => true,
}));
vi.mock('@/v2/components/ui/MoreOptions', () => ({ default: () => null }));
vi.mock('@/v2/components/ui/Markdown', () => ({ default: () => null }));
vi.mock('@/v2/components/idea/LikeStat/useIdeaLike', () => ({
  useIdeaLike: () => ({ liked: false, count: 7, toggle: () => {}, pending: false }),
}));

const idea = {
  hash_id: 'i1',
  title: 'An idea',
  content: '',
  displayname: 'Ana',
  created: '2026-01-01',
  room_hash_id: 'r1',
  approved: 1,
  is_winner: 0,
  sum_likes: 7,
  sum_votes: 0,
  sum_comments: 0,
  number_of_votes: 4,
  number_of_users: 10,
} as IdeaType;

const renderAt = (phase: string, props: Partial<ComponentProps<typeof Idea>> = {}) =>
  render(
    <MemoryRouter initialEntries={[`/room/r1/phase/${phase}`]}>
      <Routes>
        <Route path="/room/:room_id/phase/:phase" element={<Idea idea={idea} {...props} />} />
      </Routes>
    </MemoryRouter>
  );

const barOf = (container: HTMLElement) => container.querySelector('[role="progressbar"]');

const likeButton = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('button')).find((b) =>
    b.getAttribute('aria-label')?.includes('tooltips.heart')
  );

describe('Idea metrics by phase', () => {
  it('lets the viewer like an idea while ideas are still open', () => {
    const { container } = renderAt('0');
    expect(likeButton(container)).toBeTruthy();
  });

  it('freezes likes once approval starts', () => {
    const { container, getByText } = renderAt('20');
    expect(likeButton(container)).toBeUndefined();
    expect(getByText('7')).toBeTruthy();
  });

  it('drops the like metric entirely from voting on', () => {
    const { container, queryByText } = renderAt('30');
    expect(likeButton(container)).toBeUndefined();
    expect(queryByText('7')).toBeNull();
  });

  it('draws turnout as a quorum bar in voting and results', () => {
    for (const phase of ['30', '40']) {
      const { container } = renderAt(phase);
      expect(barOf(container)?.getAttribute('aria-valuenow')).toBe('40');
    }
  });

  it('takes the quorum denominator from the room when the endpoint omits it', () => {
    const { container } = renderAt('0', {
      idea: { ...idea, number_of_users: undefined as unknown as number },
      quorum: 40,
      users: 10,
    });
    expect(barOf(container)?.getAttribute('aria-valuenow')).toBe('70');
  });

  it('measures likes against the quorum before voting opens', () => {
    for (const phase of ['0', '10', '20']) {
      const { container } = renderAt(phase, { quorum: 40 });
      expect(barOf(container)?.getAttribute('aria-valuenow')).toBe('70');
    }
  });

  it('leaves the early phases barless when no quorum is set', () => {
    for (const phase of ['0', '10', '20']) {
      expect(barOf(renderAt(phase).container)).toBeNull();
    }
  });

  it('still draws voting turnout with no quorum configured', () => {
    expect(barOf(renderAt('30').container)).toBeTruthy();
  });

  it('drops the quorum bar on a rejected idea once voting starts', () => {
    for (const phase of ['30', '40']) {
      expect(barOf(renderAt(phase, { idea: { ...idea, approved: -1 } }).container)).toBeNull();
    }
  });

  it('still shows a rejected idea its likes quorum during approval', () => {
    const { container } = renderAt('20', { idea: { ...idea, approved: -1 }, quorum: 40 });
    expect(barOf(container)?.getAttribute('aria-valuenow')).toBe('70');
  });
});
