import { DefaultUpdate } from '@/types/Generics';
import { UpdateVariant } from './UpdateCard/updateVariant';

export type UpdateEvent = DefaultUpdate & { variant: UpdateVariant };

export type VoteTally = { for: number; against: number; neutral: number };

export interface IdeaUpdate extends Pick<DefaultUpdate, 'idea_id' | 'title' | 'room_id' | 'topic_id' | 'phase_id'> {
  comments: number;
  votes: VoteTally;
}

const voteKey = (value = 0): keyof VoteTally => (value > 0 ? 'for' : value < 0 ? 'against' : 'neutral');

/** One entry per idea, in order of first appearance. */
export const groupUpdates = (events: UpdateEvent[]): IdeaUpdate[] => {
  const byIdea = new Map<string, IdeaUpdate>();
  events.forEach(({ variant, vote_value, idea_id, title, room_id, topic_id, phase_id }) => {
    const idea = byIdea.get(idea_id) ?? {
      idea_id,
      title,
      room_id,
      topic_id,
      phase_id,
      comments: 0,
      votes: { for: 0, against: 0, neutral: 0 },
    };
    if (variant === 'comments') idea.comments += 1;
    else idea.votes[voteKey(vote_value)] += 1;
    byIdea.set(idea_id, idea);
  });
  return [...byIdea.values()];
};

export const countVotes = ({ votes }: IdeaUpdate) => votes.for + votes.against + votes.neutral;

export const countEvents = (idea: IdeaUpdate) => idea.comments + countVotes(idea);
