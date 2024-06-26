import { amber, green, grey, red } from '@mui/material/colors';

export type Vote = -1 | 0 | 1;

export interface VoteOptions {
  label: 'against' | 'neutral' | 'for';
  bg: string;
  color: string;
  button: string;
}

export const votingOptions: VoteOptions[] = [
  {
    label: 'against',
    bg: red[200],
    color: '#000',
    button: red[300],
  },
  {
    label: 'neutral',
    bg: amber[200],
    color: '#000',
    button: amber[300],
  },
  {
    label: 'for',
    bg: green[200],
    color: '#000',
    button: green[300],
  },
];

export const noVoteOptions = {
  bg: grey[200],
  color: grey[600],
  button: 'transparent',
};
