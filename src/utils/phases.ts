import { green, amber, deepPurple, deepOrange, blue, grey, red } from '@mui/material/colors';

export const allPhases = {
  wild: {
    name: 'Wild Ideas',
    description: 'Wild Ideas',
    color: blue[100],
    icon: 'idea',
    phase_id: 0,
  },
  discussion: {
    name: 'Discussion',
    description: 'Ideas in Discussion',
    color: deepPurple[100],
    icon: 'discussion',
    phase_id: 10,
  },
  approval: {
    name: 'Approval',
    description: 'Ideas Under Approval',
    color: deepOrange[100],
    icon: 'approval',
    phase_id: 20,
  },
  voting: {
    name: 'Voting',
    description: 'Ideas on Voting',
    color: amber[100],
    icon: 'vote',
    phase_id: 30,
  },
  result: {
    name: 'Results',
    description: 'Idea Results',
    color: green[100],
    icon: 'chart',
    phase_id: 40,
  },
  success: {
    name: 'Successful',
    description: 'Successful Ideas',
    color: green[100],
    icon: 'check',
    phase_id: 40,
  },
  reject: {
    name: 'Rejected',
    description: 'Rejected Ideas',
    color: red[100],
    icon: 'cancel',
    phase_id: 40,
  },
  dismissal: {
    name: 'Dismissed',
    description: 'Ideas not feasible',
    color: grey[100],
    icon: 'forbid',
    phase_id: 40,
  },
};

export const phases = (({ dismissal, success, reject, ...o }) => o)(allPhases);
export const dashboardPhases = (({ result, dismissal, ...o }) => o)(allPhases);
