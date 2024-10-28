type phaseType = 'wild' | 'discussion' | 'approval' | 'voting' | 'results';

export const phases = {
  '0': 'wild',
  '10': 'discussion',
  '20': 'approval',
  '30': 'voting',
  '40': 'results',
} as Record<string, phaseType>;

export const dashboardPhases = { ...(({ ['40']: _, ...o }) => o)(phases) };
