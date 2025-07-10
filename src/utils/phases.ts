import { PhaseType, RoomPhases } from '@/types/SettingsTypes';

/** Voting phases:
 * 0 - Wild Ideas
 * 10 - Discussion
 * 20 - Approval
 * 30 - Voting
 * 40 - Results
 */

export const phases = {
  '0': 'wild',
  '10': 'discussion',
  '20': 'approval',
  '30': 'voting',
  '40': 'results',
} as Record<RoomPhases, PhaseType>;

export const phaseOptions = [
  { label: 'phases.discussion', value: 10, disabled: false },
  { label: 'phases.approval', value: 20, disabled: false },
  { label: 'phases.voting', value: 30, disabled: false },
  { label: 'phases.results', value: 40, disabled: false },
];

export const dashboardPhases = { ...(({ ['40']: _, ...o }) => o)(phases) };
