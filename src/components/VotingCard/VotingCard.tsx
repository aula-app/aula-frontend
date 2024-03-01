import { Button, Card, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { grey } from '@mui/material/colors';
import { GroupAdd } from '@mui/icons-material';
import { useState } from 'react';
import { Vote, votingOptions } from '@/utils/voting';

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
              <Typography fontSize={75}>{ votingOptions[v as Vote]['icon']  }</Typography>
              { votingOptions[v as Vote]['label'] }
            </Stack>
          </Button>
        ))}
      </Stack>
    </Card>
  );
};

export default IdeaBox;
