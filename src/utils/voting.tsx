import { CheckCircle, Circle, DoNotDisturbOn, GroupAdd } from '@mui/icons-material';
import { amber, green, red } from "@mui/material/colors";

export type Vote = -1 | 0 | 1;

export interface VoteOptions {
    label: string;
    bg: string;
    color: string;
    button: string;
    icon: React.ReactNode;
}

export const votingOptions: VoteOptions[] = [
  {
    label: 'against',
    bg: red[200],
    color: red[800],
    button: red[300],
    icon: <DoNotDisturbOn sx={{fontSize: 'inherit' }} />,
  },
  {
    label: 'neutral',
    bg: amber[200],
    color: amber[800],
    button: amber[300],
    icon: <Circle sx={{fontSize: 'inherit' }} />,
  },
  {
    label: 'for',
    bg: green[200],
    color: green[800],
    button: green[300],
    icon: <CheckCircle sx={{fontSize: 'inherit' }} />,
  },
];