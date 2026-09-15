import { IdeaType } from '@/types/Scopes';
import { render } from '@testing-library/react';
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
vi.mock('./../LikeStat/useIdeaLike', () => ({
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

const renderAt = (phase: string) =>
  render(
    <MemoryRouter initialEntries={[`/room/r1/phase/${phase}`]}>
      <Routes>
        <Route path="/room/:room_id/phase/:phase" element={<Idea idea={idea} />} />
      </Routes>
    </MemoryRouter>
  );

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
      const bar = container.querySelector('[role="progressbar"]');
      expect(bar).toBeTruthy();
      // 4 of 10 eligible voters
      expect(bar?.getAttribute('aria-valuenow')).toBe('40');
    }
  });

  it('has no quorum bar before voting', () => {
    expect(renderAt('20').container.querySelector('[role="progressbar"]')).toBeNull();
  });

  it('has no quorum bar on an idea that was not approved', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/room/r1/phase/30']}>
        <Routes>
          <Route path="/room/:room_id/phase/:phase" element={<Idea idea={{ ...idea, approved: -1 }} />} />
        </Routes>
      </MemoryRouter>
    );
    expect(container.querySelector('[role="progressbar"]')).toBeNull();
  });
});
