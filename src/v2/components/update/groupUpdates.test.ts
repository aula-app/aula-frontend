import { describe, expect, it } from 'vitest';
import { countEvents, groupUpdates, UpdateEvent } from './groupUpdates';

const event = (idea_id: string, variant: UpdateEvent['variant'], vote_value?: number): UpdateEvent => ({
  id: `${idea_id}-${variant}-${vote_value}`,
  idea_id,
  title: `Idea ${idea_id}`,
  room_id: '1',
  topic_id: null,
  phase_id: null,
  variant,
  vote_value,
});

describe('groupUpdates', () => {
  it('merges the votes and comments of an idea into one entry, in order of first appearance', () => {
    const ideas = groupUpdates([event('b', 'votes', 1), event('a', 'votes', -1), event('b', 'comments')]);

    expect(ideas.map((idea) => idea.idea_id)).toEqual(['b', 'a']);
    expect(ideas[0]).toMatchObject({ title: 'Idea b', comments: 1, votes: { for: 1, against: 0, neutral: 0 } });
  });

  it('tallies votes by value', () => {
    const [idea] = groupUpdates([
      event('a', 'votes', 1),
      event('a', 'votes', 1),
      event('a', 'votes', -1),
      event('a', 'votes', 0),
    ]);

    expect(idea.votes).toEqual({ for: 2, against: 1, neutral: 1 });
    expect(countEvents(idea)).toBe(4);
  });
});
