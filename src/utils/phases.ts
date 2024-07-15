import { ICONS } from '@/components/AppIcon/AppIcon';
import { ObjectPropByName } from '@/types/Generics';
import { green, amber, deepPurple, deepOrange, blue, grey, red } from '@mui/material/colors';

interface phaseType {
  name: string;
  color: string;
  baseColor: ObjectPropByName;
}

export const phases = {
  '0': {
    name: 'wild',
    color: blue[100],
    baseColor: blue,
  },
  '10': {
    name: 'discussion',
    color: deepPurple[100],
    baseColor: deepPurple,
  },
  '20': {
    name: 'approval',
    color: deepOrange[100],
    baseColor: deepOrange,
  },
  '30': {
    name: 'voting',
    color: amber[100],
    baseColor: amber,
  },
  '40': {
    name: 'results',
    color: green[100],
    baseColor: green,
  },
} as Record<string, phaseType>;

export const approvalVariants = {
  approved: {
    name: 'approved',
    color: amber[100],
    baseColor: amber,
  },
  rejected: {
    name: 'rejected',
    color: grey[200],
    baseColor: grey,
  },
};

export const votingVariants = {
  for: {
    name: 'for',
    color: green[100],
    baseColor: green,
  },
  neutral: {
    name: 'neutral',
    color: green[100],
    baseColor: green,
  },
  against: {
    name: 'against',
    color: red[100],
    baseColor: red,
  },
};

export const resultVariants = {
  success: {
    name: 'approved',
    color: green[100],
    baseColor: green,
  },
  failure: {
    name: 'notApproved',
    color: red[100],
    baseColor: red,
  },
};

export const dashboardPhases = { ...(({ ['40']: _, ...o }) => o)(phases) };
