import { CheckCircle, Circle, DoNotDisturbOn, GroupAdd } from '@mui/icons-material';
import { amber, green, red } from "@mui/material/colors";

export type Vote = 'for' | 'neutral' | 'against';

export interface VoteOptions {
    label: string;
    bg: string;
    color: string;
    button: string;
    icon: React.ReactNode;
}

export interface VotingOptions {
  for: VoteOptions;
  neutral: VoteOptions;
  against: VoteOptions;
}

export const votingOptions: VotingOptions = {
  for: {
    label: 'for',
    bg: green[200],
    color: green[800],
    button: green[300],
    icon: <CheckCircle sx={{fontSize: 'inherit' }} />,
  },
  neutral: {
    label: 'neutral',
    bg: amber[200],
    color: amber[800],
    button: amber[300],
    icon: <Circle sx={{fontSize: 'inherit' }} />,
  },
  against: {
    label: 'against',
    bg: red[200],
    color: red[800],
    button: red[300],
    icon: <DoNotDisturbOn sx={{fontSize: 'inherit' }} />,
  },
};