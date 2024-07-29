import { IdeaType } from '@/types/Scopes';
import { RoomPhases } from '@/types/SettingsTypes';
import { databaseRequest, phases, votingOptions } from '@/utils';
import { Card, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { AppIcon } from '..';
import { CategoryIconType } from '../AppIcon/AppIcon';

interface IdeaCardProps {
  idea: IdeaType;
  phase: RoomPhases;
}

/**
 * Renders "IdeaCard" component
 */
const IdeaCard = ({ idea, phase }: IdeaCardProps) => {
  const [vote, setVote] = useState(0);
  const [icon, setIcon] = useState<CategoryIconType>();
  const [variant, setVariant] = useState<string>();

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

  const getIcon = async () =>
    await databaseRequest({
      model: 'Idea',
      method: 'getIdeaCategory',
      arguments: {
        idea_id: idea.id,
      },
    }).then((response) => (response.data ? setIcon(response.data.description_internal) : setIcon(undefined)));

  const getVariant = () => {
    switch (Number(phase)) {
      case 40:
        return vote === 1 || idea.is_winner ? 'for' : 'against';
      case 20:
        if (idea.approved === 1) return 'for';
        if (idea.approved === -1) return 'disabled';
      case 30:
        if (vote === 1) return 'for';
        if (vote === -1) return 'against';
      default:
        return phases[phase].name;
    }
  };

  useEffect(() => {
    setVariant(getVariant());
  }, [vote]);

  useEffect(() => {
    getIcon();
    if (Number(phase) === 30) getVote();
  }, []);

  return (
    <Card
      sx={{
        borderRadius: '25px',
        overflow: 'hidden',
        scrollSnapAlign: 'center',
        bgcolor: `${variant}.main`,
      }}
      variant="outlined"
    >
      <Stack direction="row" height={68} alignItems="center">
        <Stack pl={2}>
          {Number(phase) >= 40 ? (
            <AppIcon icon={idea.is_winner > 0 ? 'for' : 'against'} size="xl" />
          ) : icon ? (
            <AppIcon icon={icon} />
          ) : (
            <></>
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
            <AppIcon icon={votingOptions[vote + 1]} />
          ) : (
            <>
              {votingOptions.map((vote) => (
                <Stack direction="row" alignItems="center" key={vote}>
                  <AppIcon icon={vote} size="small" />{' '}
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
