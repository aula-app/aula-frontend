import { red, green, amber, blueGrey, deepPurple, orange, brown } from '@mui/material/colors';
import { CheckCircle, DoNotDisturbOn, Forum, HowToVote, Lightbulb, Poll, WorkspacePremium } from '@mui/icons-material';

const phases = {
    wild: {
      name: 'Wild Ideas',
      description: 'Wild Ideas',
      color: blueGrey[100],
      icon: Lightbulb
    },
    idea: {
      name: 'Discussion',
      description: 'Ideas in Discussion',
      color: deepPurple[100],
      icon: Forum
    },
    approval: {
      name: 'Approval',
      description: 'Ideas Under Approval',
      color: orange[100],
      icon: WorkspacePremium
    },
    voting: {
      name: 'Voting',
      description: 'Ideas on Voting',
      color: amber[100],
      icon: HowToVote
    },
    result: {
      name: 'Results',
      description: 'Idea Results',
      color: brown[100],
      icon: Poll
    },
    success: {
      name: 'Successful',
      description: 'Successful Ideas',
      color: green[100],
      icon: CheckCircle
    },
    reject: {
      name: 'Rejected',
      description: 'Rejected Ideas',
      color: red[100],
      icon: DoNotDisturbOn
    }
}

export default phases;