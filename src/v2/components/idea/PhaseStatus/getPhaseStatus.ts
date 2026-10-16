import { IdeaType } from '@/types/Scopes';
import { PhaseType, RoomPhases } from '@/types/SettingsTypes';
import { phases, toVerdict, Vote } from '@/utils';
import { ICON_TYPE } from '@/v2/components/ui/Icon/Icon';

/** Palette a status paints in, for the bars that follow it. */
export type StatusTone = PhaseType | 'success' | 'error' | 'neutral';

export interface PhaseStatus {
  icon: ICON_TYPE;
  label: string;
  /** bg/text pair shared by the badge and the idea bubble, so both always agree. */
  colors: string;
  /** The same palette as a single name, for components that build their own classes. */
  tone: StatusTone;
}

const POSITIVE = { colors: 'bg-success text-success-fg', tone: 'success' } as const;
const NEGATIVE = { colors: 'bg-error text-error-fg', tone: 'error' } as const;
const NEUTRAL = { colors: 'bg-neutral text-neutral-fg', tone: 'neutral' } as const;

export const getPhaseColor = (phase: `${RoomPhases}`) => phases[phase] ?? 'wild';

export const getPhaseColors = (phase: `${RoomPhases}`) => {
  const color = getPhaseColor(phase);
  return `bg-${color}-light text-${color}-fg`;
};

interface PhaseStatusInput {
  idea: IdeaType;
  phase: `${RoomPhases}`;
  /** The current user's vote. Null or undefined — not voted, still loading, or not allowed to vote — all read as waiting. */
  vote?: Vote | null;
}

const WAITING_LABEL = 'v2.scopes.ideas.status.waiting';
const REJECTED_LABEL = 'v2.scopes.ideas.status.rejected';
const TAKEN_FORWARD_LABEL = 'v2.scopes.ideas.status.takenForward';
const NOT_TAKEN_FORWARD_LABEL = 'v2.scopes.ideas.status.notTakenForward';

const WAITING = (phase: `${RoomPhases}`): PhaseStatus => ({
  icon: 'clock',
  label: WAITING_LABEL,
  colors: getPhaseColors(phase),
  tone: getPhaseColor(phase),
});

const VOTED: Record<Vote, PhaseStatus> = {
  1: { icon: 'for', label: 'v2.scopes.ideas.status.votedFor', ...POSITIVE },
  0: { icon: 'neutral', label: 'v2.scopes.ideas.status.votedNeutral', ...NEUTRAL },
  [-1]: { icon: 'against', label: 'v2.scopes.ideas.status.votedAgainst', ...NEGATIVE },
};

/** Status badge for the current phase, or null when the phase has none. */
export const getPhaseStatus = ({ idea, phase, vote }: PhaseStatusInput): PhaseStatus | null => {
  if (phase === '20') {
    if (idea.approved === 1) return { icon: 'star', label: 'v2.scopes.ideas.status.approved', ...POSITIVE };
    if (idea.approved === -1) return { icon: 'noSymbol', label: REJECTED_LABEL, ...NEGATIVE };
    return WAITING(phase);
  }

  const isArchived = (phase === '30' || phase === '40') && idea.approved === -1;
  if (isArchived) return { icon: 'noSymbol', label: REJECTED_LABEL, ...NEUTRAL };

  if (phase === '30') return vote == null ? WAITING(phase) : VOTED[vote];

  if (phase === '40') {
    const verdict = toVerdict(idea.is_winner);
    if (verdict === 1) return { icon: 'check', label: TAKEN_FORWARD_LABEL, ...POSITIVE };
    if (verdict === -1) return { icon: 'close', label: NOT_TAKEN_FORWARD_LABEL, ...NEGATIVE };
    // Not the phase palette here: results is green, which is the winner's colour.
    return { icon: 'clock', label: WAITING_LABEL, ...NEUTRAL };
  }

  return null;
};
