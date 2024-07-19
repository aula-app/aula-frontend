import { Stack, Typography } from '@mui/material';
import { Card } from '@mui/material';
import { AppIcon } from '..';
import { approvalVariants, databaseRequest, phases, votingOptions, votingVariants } from '@/utils';
import { useParams } from 'react-router-dom';
import { IdeaType } from '@/types/Scopes';
import { useEffect, useState } from 'react';
import { RoomPhases } from '@/types/SettingsTypes';

interface IdeaCardProps {
  idea: IdeaType;
  phase: RoomPhases;
}

/**
 * Renders "IdeaCard" component
 */
const IdeaCard = ({ idea, phase }: IdeaCardProps) => {
  const params = useParams();
  const [vote, setVote] = useState(0);
  const [bg, setBg] = useState<string>(phases[phase].baseColor[300]);

  const getVote = async () =>
    await databaseRequest(
      {
        model: 'Idea',
        method: 'getVoteValue',
        arguments: {
          idea_id: idea.id,
        },
      },
      ['user_id']
    ).then((response) => setVote(response.data));

  useEffect(() => {
    setBg(
      (Number(phase) === 30 && vote === 1) || idea.is_winner
        ? votingVariants.for.color
        : Number(phase) === 40 || vote === -1
          ? votingVariants.against.color
          : Number(phase) === 30 || idea.approved === 1
            ? approvalVariants.approved.color
            : idea.approved === 0
              ? 'transparent'
              : Number(phase) > 10
                ? approvalVariants.rejected.color
                : phases['0'].color
    );
  }, [vote]);

  useEffect(() => {
    if (Number(phase) === 30) getVote();
  }, []);

  return (
    <Card
      sx={{
        borderRadius: '25px',
        overflow: 'hidden',
        scrollSnapAlign: 'center',
        backgroundColor: bg,
      }}
      variant="outlined"
    >
      <Stack direction="row" height={68} alignItems="center">
        <Stack pl={2}>
          {Number(phase) != 40 ? (
            <AppIcon icon="camera" />
          ) : (
            <AppIcon icon={votingOptions[idea.is_winner > 0 ? 2 : 0].label} size="xl" />
          )}
        </Stack>
        <Stack flexGrow={1} px={2} overflow="hidden">
          <Typography variant="h6" noWrap textOverflow="ellipsis">
            {idea.title}
          </Typography>
          <Typography variant="body2" noWrap textOverflow="ellipsis">
            {idea.content}
          </Typography>
        </Stack>
        <Stack
          p={1}
          pl={2}
          borderLeft="1px solid currentColor"
          justifyContent="space-around"
          height="100%"
          sx={{ aspectRatio: 1 }}
        >
          {Number(phase) === 10 ? (
            <>
              <Stack direction="row" alignItems="center">
                <AppIcon icon="heart" size="small" />{' '}
                <Typography fontSize="small" ml={0.5}>
                  {idea.sum_likes}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center">
                <AppIcon icon="chat" size="small" />{' '}
                <Typography fontSize="small" ml={0.5}>
                  {idea.sum_comments}
                </Typography>
              </Stack>
            </>
          ) : Number(phase) === 20 ? (
            <>
              {idea.approved === 1 ? (
                <AppIcon icon="approved" />
              ) : idea.approved === -1 ? (
                <AppIcon icon="rejected" />
              ) : (
                <AppIcon icon={phases[phase].name} />
              )}
            </>
          ) : Number(phase) === 30 ? (
            <AppIcon icon={votingOptions[vote + 1].label} />
          ) : (
            <>
              {votingOptions.map((vote) => (
                <Stack direction="row" alignItems="center" key={vote.label}>
                  <AppIcon icon={votingVariants[vote.label].name} size="small" />{' '}
                  <Typography fontSize="small" ml={0.5}>
                    {0}
                  </Typography>
                </Stack>
              ))}
            </>
          )}
        </Stack>
      </Stack>
    </Card>
  );
};

export default IdeaCard;
