import { ObjectPropByName } from '@/types/Generics';
import { RoomPhases } from '@/types/RoomTypes';
import { green, amber, deepPurple, deepOrange, blue, grey, red } from '@mui/material/colors';

interface phaseType {
  name: string,
  description: string,
  color: string,
  baseColor: ObjectPropByName,
  icon: string,
  phase_id: number,
}

export const allPhases = {
  wild: {
    name: 'Wild Ideas',
    description: 'Wild Ideas',
    color: blue[100],
    baseColor: blue,
    icon: 'idea',
    phase_id: 0,
  },
  discussion: {
    name: 'Discussion',
    description: 'Ideas in Discussion',
    color: deepPurple[100],
    baseColor: deepPurple,
    icon: 'discussion',
    phase_id: 10,
  },
  approval: {
    name: 'Approval',
    description: 'Ideas Under Approval',
    color: deepOrange[100],
    baseColor: deepOrange,
    icon: 'approval',
    phase_id: 20,
  },
  voting: {
    name: 'Voting',
    description: 'Ideas on Voting',
    color: amber[100],
    baseColor: amber,
    icon: 'vote',
    phase_id: 30,
  },
  result: {
    name: 'Results',
    description: 'Idea Results',
    color: green[100],
    baseColor: green,
    icon: 'chart',
    phase_id: 40,
  },
  success: {
    name: 'Successful',
    description: 'Successful Ideas',
    color: green[100],
    baseColor: green,
    icon: 'check',
    phase_id: 40,
  },
  reject: {
    name: 'Rejected',
    description: 'Rejected Ideas',
    color: red[100],
    baseColor: red,
    icon: 'cancel',
    phase_id: 40,
  },
  dismissal: {
    name: 'Dismissed',
    description: 'Ideas not feasible',
    color: grey[100],
    baseColor: grey,
    icon: 'forbid',
    phase_id: 40,
  },
};

export const phases = (({ dismissal, success, reject, ...o }) => o)(allPhases) as Record<RoomPhases, phaseType>;
export const dashboardPhases = (({ result, dismissal, ...o }) => o)(allPhases);
