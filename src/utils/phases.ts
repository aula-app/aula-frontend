import { ObjectPropByName } from '@/types/Generics';
import { amber, blue, deepOrange, deepPurple, green, grey, red } from '@mui/material/colors';

interface phaseType {
  name: 'wild' | 'discussion' | 'approval' | 'voting' | 'results';
}

export const phases = {
  '0': {
    name: 'wild',
  },
  '10': {
    name: 'discussion',
  },
  '20': {
    name: 'approval',
  },
  '30': {
    name: 'voting',
  },
  '40': {
    name: 'results',
  },
} as Record<string, phaseType>;

export const dashboardPhases = { ...(({ ['40']: _, ...o }) => o)(phases) };
