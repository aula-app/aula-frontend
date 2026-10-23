import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { IdeaUpdate } from '../groupUpdates';
import UpdateCard from './UpdateCard';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, vars?: { count?: number }) => (vars?.count !== undefined ? `${key}:${vars.count}` : key),
  }),
}));

const update = (overrides: Partial<IdeaUpdate> = {}): IdeaUpdate => ({
  idea_id: 'idea1',
  room_id: '1',
  topic_id: 'box1',
  phase_id: '30',
  title: 'Longer breaks',
  comments: 0,
  votes: { for: 0, against: 0, neutral: 0 },
  ...overrides,
});

const renderCard = (item: IdeaUpdate) =>
  render(
    <MemoryRouter>
      <UpdateCard update={item} />
    </MemoryRouter>
  );

describe('UpdateCard', () => {
  it('links to the idea inside its box', () => {
    renderCard(update());

    expect(screen.getByRole('link')).toHaveAttribute('href', '/room/1/phase/30/idea-box/box1/idea/idea1');
  });

  it('links to the wild ideas phase when the idea has no box', () => {
    renderCard(update({ topic_id: null, phase_id: null }));

    expect(screen.getByRole('link')).toHaveAttribute('href', '/room/1/phase/0/idea/idea1');
  });

  it('names the phase and takes its colour', () => {
    renderCard(update({ phase_id: '40' }));

    expect(screen.getByText('phases.results')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveClass('bg-results');
  });

  it('summarises the new comments and votes, with the votes broken down by value', () => {
    renderCard(update({ comments: 2, votes: { for: 2, against: 1, neutral: 0 } }));

    expect(screen.getByText('v2.scopes.updates.activity.comments:2')).toBeInTheDocument();
    expect(
      screen.getByText(
        'v2.scopes.updates.activity.votes:3 (v2.scopes.updates.activity.for:2, v2.scopes.updates.activity.against:1)'
      )
    ).toBeInTheDocument();
  });

  it('leaves out the kind of activity the idea has none of', () => {
    renderCard(update({ comments: 1 }));

    expect(screen.queryByText(/activity\.votes/)).toBeNull();
  });
});
