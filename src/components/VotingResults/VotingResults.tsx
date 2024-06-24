import { Stack, Typography } from '@mui/material';
import { Card } from '@mui/material';
import { useParams } from 'react-router-dom';
import { green, grey, red } from '@mui/material/colors';
import { votingOptions, Vote } from '@/utils';
import AppIcon from '../AppIcon';

interface IdeaBoxProps {
  rejected?: boolean;
  yourVote: Vote;
}

/**
 * Renders "VotingResults" component
 */
const IdeaBox = ({ rejected = false, yourVote }: IdeaBoxProps) => {
  const params = useParams();

  return (
    <Stack mb={2}>
      <Card
        sx={{
          borderRadius: '25px',
          overflow: 'hidden',
          scrollSnapAlign: 'center',
          bgcolor: rejected ? red[200] : green[200],
          color: rejected ? red[600] : green[600],
        }}
        variant="outlined"
      >
        <Stack direction="row" alignItems="center">
          <Stack
            height="75px"
            alignItems="center"
            justifyContent="center"
            fontSize={40}
            sx={{
              aspectRatio: 1,
            }}
          >
            {!rejected
              ? <AppIcon icon="for" size='xl' />
              : <AppIcon icon="against" size='xl' />}
          </Stack>
          <Stack flexGrow={1} pr={2}>
            <Typography variant="body2">
              {rejected ? 'This idea was not approved.' : 'This idea was approved.'}
            </Typography>
          </Stack>
          <Stack>
            {votingOptions.map((option, i) => (
              <Stack direction="row" alignItems="center" fontSize="small" key={i} mr={1.5} sx={{ whiteSpace: 'nowrap' }}>
                <AppIcon icon={option.label} size='small' sx={{mr: .5}} /> 3
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Card>
      <Stack direction="row" alignItems="center" color={grey[600]} mx={3} mt={1} fontSize="small">
        <AppIcon icon={votingOptions[yourVote].label} />&nbsp; You voted {votingOptions[yourVote].label} this idea
      </Stack>
    </Stack>
  );
};

export default IdeaBox;
