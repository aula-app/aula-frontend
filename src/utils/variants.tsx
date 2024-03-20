import { CheckCircle, Circle, DoNotDisturbOn, WorkspacePremium } from '@mui/icons-material';
import { amber, green, grey, lightGreen, red } from "@mui/material/colors";

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
    icon: <DoNotDisturbOn sx={{fontSize: "inherit"}} />,
  },
  {
    label: 'neutral',
    bg: amber[200],
    color: amber[800],
    button: amber[300],
    icon: <Circle sx={{fontSize: "inherit"}} />,
  },
  {
    label: 'for',
    bg: green[200],
    color: green[800],
    button: green[300],
    icon: <CheckCircle sx={{fontSize: "inherit"}} />,
  },
];

export const variantOptions = {
  discussion: {
    color: 'inherit',
    bg: 'transparent',
    icon: <></>,
  },
  approved: {
    color: amber[800],
    bg: amber[100],
    icon: <WorkspacePremium sx={{fontSize: "inherit"}} />,
  },
  dismissed: {
    color: votingOptions[0].color,
    bg: votingOptions[0].bg,
    icon: votingOptions[0].icon,
  },
  voting: {
    color: 'inherit',
    bg: 'transparent',
    icon: <></>,
  },
  voted: {
    color: votingOptions[2].color,
    bg: votingOptions[2].bg,
    icon: votingOptions[2].icon,
  },
  neutral: {
    color: votingOptions[1].color,
    bg: votingOptions[1].bg,
    icon: votingOptions[1].icon,
  },
  rejected: {
    color: votingOptions[0].color,
    bg: votingOptions[0].bg,
    icon: votingOptions[0].icon,
  },
};