import { green, amber, deepPurple, deepOrange, blue, grey, red } from '@mui/material/colors';

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
    description: 'Ideas in Discussion',
    color: deepPurple[100],
    baseColor: deepPurple,
    icon: 'discussion',
  },
  '20': {
    name: 'Approval',
    description: 'Ideas Under Approval',
    color: deepOrange[100],
    baseColor: deepOrange,
    icon: 'approval',
  },
  '30': {
    name: 'Voting',
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
};

export const approvalVariants = {
  approved: {
    name: 'Approved',
    description: 'Approved Ideas',
    color: amber[100],
    baseColor: amber,
    icon: 'approved',
    phase_id: 40,
  },
  rejected: {
    name: 'Not Approved',
    description: 'Not Approved Ideas',
    color: grey[200],
    baseColor: grey,
    icon: 'rejected',
    phase_id: 40,
  },
}

export const votingVariants = {
  for: {
    name: 'For',
    description: 'Voted for idea',
    color: green[100],
    baseColor: green,
    icon: 'for',
    phase_id: 40,
  },
  neutral: {
    name: 'Neutral',
    description: 'Neutral Ideas',
    color: green[100],
    baseColor: green,
    icon: 'neutral',
    phase_id: 40,
  },
  against: {
    name: 'Against',
    description: 'Voted against Ideas',
    color: red[100],
    baseColor: red,
    icon: 'against',
    phase_id: 40,
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

export const dashboardPhases = {...(({ ['40']: _, ...o }) => o)(phases), ...resultVariants};
