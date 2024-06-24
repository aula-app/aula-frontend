import { CheckCircle, Circle, DoNotDisturbOn, WorkspacePremium } from '@mui/icons-material';
import { amber, green, grey, red } from "@mui/material/colors";

export type Vote = -1 | 0 | 1;

export interface VoteOptions {
    label: string;
    bg: string;
    color: string;
    button: string;
}

export const votingOptions: VoteOptions[] = [
  {
    label: 'against',
    bg: red[200],
    color: "#000",
    button: red[300],
  },
  {
    label: 'neutral',
    bg: amber[200],
    color: "#000",
    button: amber[300],
  },
  {
    label: 'for',
    bg: green[200],
    color: "#000",
    button: green[300],
  },
];

export const noVoteOptions = {
  bg: grey[200],
  color: grey[600],
  button: 'transparent',
}

export const variantOptions = {
  discussion: {
    color: 'inherit',
    bg: 'transparent',
  },
  approved: {
    color: amber[800],
    bg: amber[100],
  },
  dismissed: {
    color: grey[600],
    bg: grey[200],
  },
  voting: {
    color: 'inherit',
    bg: 'transparent',
  },
  voted: {
    color: votingOptions[2].color,
    bg: votingOptions[2].bg,
  },
  neutral: {
    color: votingOptions[1].color,
    bg: votingOptions[1].bg,
  },
  rejected: {
    color: votingOptions[0].color,
    bg: votingOptions[0].bg,
  },
};