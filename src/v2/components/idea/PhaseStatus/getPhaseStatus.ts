import { IdeaType } from '@/types/Scopes';
import { RoomPhases } from '@/types/SettingsTypes';
import { phases, Vote } from '@/utils';
import { ICON_TYPE } from '@/v2/components/ui/Icon/Icon';

export interface PhaseStatus {
  icon: ICON_TYPE;
  label: string;
  /** bg/text pair shared by the badge and the idea bubble, so both always agree. */
  colors: string;
}

const POSITIVE = 'bg-success text-success-fg';
const NEGATIVE = 'bg-error text-error-fg';
const NEUTRAL = 'bg-neutral text-neutral-fg';

/** Palette name of a phase, defaulting to the wild-ideas one for unknown phases. */
export const getPhaseColor = (phase: `${RoomPhases}`) => phases[phase] ?? 'wild';

/** Filled pair of the phase itself — the "nothing decided yet" look. */
export const getPhaseColors = (phase: `${RoomPhases}`) => {
  const color = getPhaseColor(phase);
  return `bg-${color}-light text-${color}-fg`;
};

interface PhaseStatusInput {
  idea: IdeaType;
  phase: `${RoomPhases}`;
  /** The current user's vote. Null or undefined — not voted, still loading, or not allowed to vote — all read as waiting. */
  vote?: Vote | null;
  /** Percentage of eligible users that must vote. 0 or undefined means no quorum is configured. */
  quorum?: number;
}

const reachedQuorum = ({ idea, quorum }: PhaseStatusInput) =>
  !!quorum && idea.number_of_users > 0 && (idea.number_of_votes / idea.number_of_users) * 100 >= quorum;

const REJECTED_LABEL = 'v2.scopes.ideas.status.rejected';

const WAITING = (colors: string): PhaseStatus => ({
  icon: 'clock',
  label: 'v2.scopes.ideas.status.waiting',
  colors,
});

const VOTED: Record<Vote, PhaseStatus> = {
  1: { icon: 'for', label: 'v2.scopes.ideas.status.votedFor', colors: POSITIVE },
  0: { icon: 'neutral', label: 'v2.scopes.ideas.status.votedNeutral', colors: NEUTRAL },
  [-1]: { icon: 'against', label: 'v2.scopes.ideas.status.votedAgainst', colors: NEGATIVE },
};

/**
 * Status badge an idea carries in the current phase, or null when the phase has none.
 * Approval reports the moderation decision, voting the current user's own vote, results the outcome.
 */
export const getPhaseStatus = (input: PhaseStatusInput): PhaseStatus | null => {
  const { idea, phase, vote } = input;
  const pending = getPhaseColors(phase);

  if (phase === '20') {
    if (idea.approved === 1) return { icon: 'check', label: 'v2.scopes.ideas.status.approved', colors: POSITIVE };
    if (idea.approved === -1) return { icon: 'close', label: REJECTED_LABEL, colors: NEGATIVE };
    return WAITING(pending);
  }

  // Past approval a rejected idea is archived rather than judged again, so it reads muted.
  const isArchived = (phase === '30' || phase === '40') && idea.approved === -1;
  if (isArchived) return { icon: 'close', label: REJECTED_LABEL, colors: NEUTRAL };

  // An idea nobody has voted on yet reads the same as one awaiting approval: undecided, in phase colour.
  if (phase === '30') return vote == null ? WAITING(pending) : VOTED[vote];

  if (phase === '40') {
    if (idea.is_winner) return { icon: 'winner', label: 'v2.scopes.ideas.status.winner', colors: POSITIVE };
    if (!input.quorum) return { icon: 'results', label: 'v2.scopes.ideas.status.notSelected', colors: NEUTRAL };
    return reachedQuorum(input)
      ? { icon: 'for', label: 'v2.scopes.ideas.status.quorumReached', colors: NEUTRAL }
      : { icon: 'against', label: 'v2.scopes.ideas.status.quorumMissed', colors: NEUTRAL };
  }

  return null;
};
