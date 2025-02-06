import { IdeaType } from '@/types/Scopes';
import { RoomPhases } from '@/types/SettingsTypes';
import { databaseRequest, phases, votingOptions } from '@/utils';
import { Card, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import AppIcon, { CategoryIconType } from '@/components/AppIcon/AppIcon';
import { ObjectPropByName } from '@/types/Generics';
import MarkdownReader from '@/components/MarkdownReader';
import { getVote, getVoteResults, ResultResponse } from '@/services/vote';
import { getCategories } from '@/services/categories';

interface IdeaCardProps {
  idea: IdeaType;
  phase: RoomPhases;
  sx?: ObjectPropByName;
}

/**
 * Renders "IdeaCard" component
 */
const IdeaCard = ({ idea, phase, sx, ...restOfProps }: IdeaCardProps) => {
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vote, setVote] = useState(0);

  const [icon, setIcon] = useState<CategoryIconType>();
  const [variant, setVariant] = useState<string>();
  const [numVotes, setNumVotes] = useState<ResultResponse>({
    votes_negative: 0,
    votes_neutral: 0,
    votes_positive: 0,
  });

  const fetchResults = useCallback(async () => {
    if (!idea.hash_id) return;
    setLoading(true);
    const response = await getVoteResults(idea.hash_id);
    if (response.error) setError(response.error);
    if (!response.error && typeof response.data === 'number') setNumVotes(response.data);
    setLoading(false);
  }, [idea.hash_id]);

  const fetchVote = useCallback(async () => {
    setLoading(true);
    const response = await getVote(idea.hash_id);
    if (response.error) setError(response.error);
    if (!response.error && typeof response.data === 'number') setVote(response.data);
    setLoading(false);
  }, [idea.hash_id]);

  const getIcon = async () =>
    await getCategories(idea.hash_id).then((response) => {
      setIcon(response.data?.description_internal);
    });

  const getVariant = () => {
    switch (phase) {
      case 40:
        return vote === 1 || idea.is_winner ? 'for' : 'against';
      case 20:
        if (idea.approved === 1) return 'for';
        if (idea.approved === -1) return 'disabled';
      case 30:
        if (vote === 1) return 'for';
        if (vote === -1) return 'against';
      default:
        return phases[phase];
    }
  };

  useEffect(() => {
    setVariant(getVariant());
  }, [vote]);

  useEffect(() => {
    getIcon();
    if (phase >= 30) fetchVote();
    if (phase >= 40) fetchResults();
  }, []);

  return (
    <Card
      sx={{
        borderRadius: '25px',
        overflow: 'hidden',
        scrollSnapAlign: 'center',
        bgcolor: `${variant}.main`,
        ...sx,
      }}
      variant="outlined"
      {...restOfProps}
    >
      <Stack direction="row" height={68} alignItems="center">
        <Stack pl={2}>
          {phase >= 40 ? (
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
        </Stack>
        <Stack
          p={1}
          pl={2}
          borderLeft="1px solid currentColor"
          justifyContent="space-around"
          height="100%"
          sx={{ aspectRatio: 1 }}
        >
          {phase === 10 ? (
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
          ) : phase === 20 ? (
            <>
              {idea.approved === 1 ? (
                <AppIcon icon="approved" />
              ) : idea.approved === -1 ? (
                <AppIcon icon="rejected" />
              ) : (
                <AppIcon icon={phases[phase]} />
              )}
            </>
          ) : phase === 30 ? (
            <AppIcon icon={votingOptions[vote + 1]} />
          ) : (
            <>
              {votingOptions.map((vote, i) => {
                const voteCount = Object.values(numVotes)[i];
                return (
                  <Stack direction="row" alignItems="center" key={vote}>
                    <AppIcon icon={vote} size="small" />{' '}
                    <Typography fontSize="small" ml={0.5}>
                      {voteCount}
                    </Typography>
                  </Stack>
                );
              })}
            </>
          )}
        </Stack>
      </Stack>
    </Card>
  );
};

export default IdeaCard;
