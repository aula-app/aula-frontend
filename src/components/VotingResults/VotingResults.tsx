import { Vote, votingOptions } from '@/utils';
import { Card, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import AppIcon from '../AppIcon';

interface IdeaBoxProps {
  rejected?: boolean;
  yourVote: Vote;
}

/**
 * Renders "VotingResults" component
 */
const IdeaBox = ({ rejected = false, yourVote }: IdeaBoxProps) => {
  const { t } = useTranslation();
  const params = useParams();

  return (
    <Stack mb={2}>
      <Card
        sx={{
          borderRadius: '25px',
          overflow: 'hidden',
          scrollSnapAlign: 'center',
          bgcolor: rejected ? 'against.main' : 'for.main',
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
            {!rejected ? <AppIcon icon="for" size="xl" /> : <AppIcon icon="against" size="xl" />}
          </Stack>
          <Stack flexGrow={1} pr={2}>
            <Typography variant="body2">{t(`texts.${rejected ? 'rejected' : 'approved'}`)}</Typography>
          </Stack>
          <Stack>
            {votingOptions.map((option, i) => (
              <Stack
                direction="row"
                alignItems="center"
                fontSize="small"
                key={i}
                mr={1.5}
                sx={{ whiteSpace: 'nowrap' }}
              >
                <AppIcon icon={option} size="small" sx={{ mr: 0.5 }} /> 3
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Card>
      <Stack direction="row" alignItems="center" mx={3} mt={1} fontSize="small">
        <AppIcon icon={votingOptions[yourVote + 1]} />
        &nbsp; {t('texts.yourVote', { var: t(`votes.${votingOptions[yourVote + 1]}`) })}
      </Stack>
    </Stack>
  );
};

export default IdeaBox;
