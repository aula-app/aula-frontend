import { Button, Card, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { amber, green, grey, red } from '@mui/material/colors';
import { CheckCircle, Circle, DoNotDisturbOn, GroupAdd } from '@mui/icons-material';
import React, { useState } from 'react';

type Vote = 'for' | 'neutral' | 'against';
interface VoteOptions {
    label: string;
    bg: string;
    color: string;
    button: string;
    icon: React.ReactNode;
}
interface VotingOptions {
  for: VoteOptions;
  neutral: VoteOptions;
  against: VoteOptions;
}

const votingOptions: VotingOptions = {
  for: {
    label: 'for',
    bg: green[200],
    color: green[800],
    button: green[300],
    icon: <CheckCircle sx={{fontSize: 75}} />,
  },
  neutral: {
    label: 'neutral',
    bg: amber[200],
    color: amber[800],
    button: amber[300],
    icon: <Circle sx={{fontSize: 75}} />,
  },
  against: {
    label: 'against',
    bg: red[200],
    color: red[800],
    button: red[300],
    icon: <DoNotDisturbOn sx={{fontSize: 75}} />,
  },
};
/**
 * Renders "VotingCards" component
 * url: /
 */
const IdeaBox = () => {
  //const CurrentIcon = phases.wild.icon;
  const params = useParams();
  const [vote, setVote] = useState<Vote>('neutral');

  return (
    <Card
      sx={{
        mb: 2,
        p: 2,
        overflow: 'unset',
        scrollSnapAlign: 'center',
        bgcolor: votingOptions[vote]['bg'],
        color: votingOptions[vote]['color'],
        borderRadius: 0
      }}
    >
      <Stack direction="row">
        <Typography variant="h6">Vote</Typography>
        <Button size="small" sx={{ ml: 'auto', px: 1, bgcolor: '#fff', color: grey[600], borderRadius: 5 }}>
          <Typography variant="caption">or</Typography>
          <Typography variant="caption" color="primary" fontWeight={700} sx={{ mx: 1 }}>
            DELEGATE VOTE
          </Typography>
          <GroupAdd fontSize="small" />
        </Button>
      </Stack>
      <Stack direction="row" justifyContent="space-around" py={2}>
        {Object.keys(votingOptions).map((v, i) => (
          <Button
            sx={{
              color: 'inherit',
              backgroundColor: votingOptions[vote][`button`],
              borderRadius: 8,
            }}
            key={i}
            onClick={() => setVote(v as Vote)}
          >
            <Stack alignItems="center">
              { votingOptions[v as Vote]['icon'] }
              { votingOptions[v as Vote]['label'] }
            </Stack>
          </Button>
        ))}
      </Stack>
    </Card>
  );
};

export default IdeaBox;
