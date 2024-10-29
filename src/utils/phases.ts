import { PhaseType } from '@/types/SettingsTypes';

export const phases = {
  '0': 'wild',
  '10': 'discussion',
  '20': 'approval',
  '30': 'voting',
  '40': 'results',
} as Record<string, PhaseType>;

export const dashboardPhases = { ...(({ ['40']: _, ...o }) => o)(phases) };
