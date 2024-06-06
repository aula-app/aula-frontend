import { green, amber, deepPurple, deepOrange, blue, grey, red } from '@mui/material/colors';

export const allPhases = {
    wild: {
      name: 'Wild Ideas',
      path: 'ideas',
      description: 'Wild Ideas',
      color: blue[100],
      icon: 'idea'
    },
    discussion: {
      name: 'Discussion',
      path: 'discussion',
      description: 'Ideas in Discussion',
      color: deepPurple[100],
      icon: 'discussion'
    },
    approval: {
      name: 'Approval',
      path: 'approval',
      description: 'Ideas Under Approval',
      color: deepOrange[100],
      icon: 'approval'
    },
    voting: {
      name: 'Voting',
      path: 'voting',
      description: 'Ideas on Voting',
      color: amber[100],
      icon: 'vote'
    },
    result: {
      name: 'Results',
      path: 'result',
      description: 'Idea Results',
      color: green[100],
      icon: 'chart'
    },
    success: {
      name: 'Successful',
      path: 'success',
      description: 'Successful Ideas',
      color: green[100],
      icon: 'check'
    },
    reject: {
      name: 'Rejected',
      path: 'reject',
      description: 'Rejected Ideas',
      color: red[100],
      icon: 'cancel'
    },
    dismissal: {
      name: 'Dismissed',
      path: 'dismissal',
      description: 'Ideas not feasible',
      color: grey[100],
      icon: 'forbid'
    },
}

export const phases = (({ dismissal, success, reject, ...o }) => o)(allPhases)
export const dashboardPhases = (({ result, dismissal, ...o }) => o)(allPhases)