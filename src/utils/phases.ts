import { ICONS } from '@/components/AppIcon/AppIcon';
import { ObjectPropByName } from '@/types/Generics';
import { green, amber, deepPurple, deepOrange, blue, grey, red } from '@mui/material/colors';

interface phaseType {
  name: string,
  call?: string,
  description: string,
  color: string,
  baseColor: ObjectPropByName,
  icon: keyof typeof ICONS,
}

export const phases = {
  '0': {
    name: 'Wild Ideas',
    description: 'Wild Ideas',
    color: blue[100],
    baseColor: blue,
    icon: 'idea',
  },
  '10': {
    name: 'Discussion',
    call: 'to discuss',
    description: 'Ideas in Discussion',
    color: deepPurple[100],
    baseColor: deepPurple,
    icon: 'discussion',
  },
  '20': {
    name: 'Approval',
    call: 'on approval',
    description: 'Ideas Under Approval',
    color: deepOrange[100],
    baseColor: deepOrange,
    icon: 'approval',
  },
  '30': {
    name: 'Voting',
    call: 'to vote',
    description: 'Ideas on Voting',
    color: amber[100],
    baseColor: amber,
    icon: 'vote',
  },
  '40': {
    name: 'Results',
    description: 'Idea Results',
    color: green[100],
    baseColor: green,
    icon: 'chart',
  },
} as Record<string, phaseType>;

export const approvalVariants = {
  approved: {
    name: 'Approved',
    description: 'Approved Ideas',
    color: amber[100],
    baseColor: amber,
    icon: 'approved',
  },
  rejected: {
    name: 'Not Approved',
    description: 'Not Approved Ideas',
    color: grey[200],
    baseColor: grey,
    icon: 'rejected',
  },
}

export const votingVariants = {
  for: {
    name: 'For',
    description: 'Voted for idea',
    color: green[100],
    baseColor: green,
    icon: 'for',
  },
  neutral: {
    name: 'Neutral',
    description: 'Neutral Ideas',
    color: green[100],
    baseColor: green,
    icon: 'neutral',
  },
  against: {
    name: 'Against',
    description: 'Voted against Ideas',
    color: red[100],
    baseColor: red,
    icon: 'against',
  },
};

export const resultVariants = {
  success: {
    name: 'Approved',
    description: 'Approved Ideas',
    color: green[100],
    baseColor: green,
    icon: 'for',
    phase_id: 40,
  },
  failure: {
    name: 'Not Approved',
    description: 'Not Approved Ideas',
    color: red[100],
    baseColor: red,
    icon: 'against',
    phase_id: 40,
  },
}

export const dashboardPhases = {...(({ ['40']: _, ...o }) => o)(phases)};
