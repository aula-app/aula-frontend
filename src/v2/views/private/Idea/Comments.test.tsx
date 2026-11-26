import { TEST_IDS } from '@/test-ids';
import { CommentType } from '@/types/Scopes';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Comments from './Comments';

const comment = {
  id: 1,
  hash_id: 'c1',
  content: 'Please add bike racks',
  displayname: 'Ana',
  created: '2026-01-01',
  sum_likes: 0,
  user_hash_id: 'u1',
} as CommentType;

let commentsState: { comments: CommentType[]; isLoading: boolean; error: string | null } = {
  comments: [comment],
  isLoading: false,
  error: null,
};

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }) }));
vi.mock('./useComments', () => ({ useComments: () => ({ ...commentsState, refetch: () => {} }) }));
vi.mock('@/services/comments', () => ({ addComment: async () => ({}) }));
vi.mock('@/v2/hooks/useModal', () => ({ useModal: () => ({ openModal: () => {}, closeModal: () => {} }) }));
vi.mock('@/v2/components/comment/Comment', () => ({ default: () => <div data-testid="comment-bubble" /> }));
vi.mock('@/utils', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/utils')>()),
  checkPermissions: () => true,
}));

const renderAt = (phase: string) =>
  render(
    <MemoryRouter>
      <Comments idea_id="i1" phase={phase} />
    </MemoryRouter>
  );

describe('Comments', () => {
  beforeEach(() => {
    commentsState = { comments: [comment], isLoading: false, error: null };
  });

  it('lets the viewer add a comment while the idea is still open', async () => {
    const { queryByTestId } = renderAt('0');

    await waitFor(() => expect(queryByTestId('comment-bubble')).toBeTruthy());
    expect(queryByTestId(TEST_IDS.ADD_COMMENT_BUTTON)).toBeTruthy();
  });

  it('closes commenting once approval starts', async () => {
    const { queryByTestId } = renderAt('20');

    await waitFor(() => expect(queryByTestId('comment-bubble')).toBeTruthy());
    expect(queryByTestId(TEST_IDS.ADD_COMMENT_BUTTON)).toBeNull();
  });

  it('keeps commenting closed through voting', async () => {
    const { queryByTestId } = renderAt('30');

    expect(queryByTestId(TEST_IDS.ADD_COMMENT_BUTTON)).toBeNull();
  });

  it('shows an empty state when the idea has no comments yet', async () => {
    commentsState = { comments: [], isLoading: false, error: null };
    const { queryByTestId } = renderAt('0');

    await waitFor(() => expect(queryByTestId('idea-comments-empty-state')).toBeTruthy());
    expect(queryByTestId('comment-bubble')).toBeNull();
  });
});
