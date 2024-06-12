import { green, amber, deepPurple, deepOrange, blue, grey, red } from '@mui/material/colors';

export const allPhases = {
    ideas: {
      id: 0,
      name: 'Wild Ideas',
      path: 'ideas',
      description: 'Wild Ideas',
      color: blue[100],
      icon: 'idea'
    },
    discussion: {
      id: 10,
      name: 'Discussion',
      path: 'discussion',
      description: 'Ideas in Discussion',
      color: deepPurple[100],
      icon: 'discussion'
    },
    approval: {
      id: 20,
      name: 'Approval',
      path: 'approval',
      description: 'Ideas Under Approval',
      color: deepOrange[100],
      icon: 'approval'
    },
    voting: {
      id: 30,
      name: 'Voting',
      path: 'voting',
      description: 'Ideas on Voting',
      color: amber[100],
      icon: 'vote'
    },
    result: {
      id: 40,
      name: 'Results',
      path: 'result',
      description: 'Idea Results',
      color: green[100],
      icon: 'chart'
    },
    success: {
      id: 40,
      name: 'Successful',
      path: 'success',
      description: 'Successful Ideas',
      color: green[100],
      icon: 'check'
    },
    reject: {
      id: 40,
      name: 'Rejected',
      path: 'reject',
      description: 'Rejected Ideas',
      color: red[100],
      icon: 'cancel'
    },
    dismissal: {
      id: 40,
      name: 'Dismissed',
      path: 'dismissal',
      description: 'Ideas not feasible',
      color: grey[100],
      icon: 'forbid'
    },
}

export const phases = (({ dismissal, success, reject, ...o }) => o)(allPhases)
export const dashboardPhases = (({ result, dismissal, ...o }) => o)(allPhases)