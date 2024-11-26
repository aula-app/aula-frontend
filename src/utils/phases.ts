import { PhaseType } from '@/types/SettingsTypes';

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
} as Record<string, PhaseType>;

export const dashboardPhases = { ...(({ ['40']: _, ...o }) => o)(phases) };
