import AppIcon, { CategoryIconType } from '@/components/AppIcon/AppIcon';
import AppLink from '@/components/AppLink';
import { getCategories } from '@/services/categories';
import { getVote, getVoteResults, ResultResponse } from '@/services/vote';
import { ObjectPropByName } from '@/types/Generics';
import { IdeaType } from '@/types/Scopes';
import { RoomPhases } from '@/types/SettingsTypes';
import { checkPermissions, phases, votingOptions } from '@/utils';
import { Card, Stack, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface IdeaCardProps {
  idea: IdeaType;
  phase: RoomPhases;
  sx?: ObjectPropByName;
  quorum?: number;
  disabled?: boolean;
}

/**
 * Renders "IdeaCard" component
 */
const IdeaCard = ({ idea, phase, sx, quorum, disabled = false, ...restOfProps }: IdeaCardProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vote, setVote] = useState<number | null>();

  const [icon, setIcon] = useState<CategoryIconType>();
  const [bgColor, setBgColor] = useState<string>();
  const [numVotes, setNumVotes] = useState<ResultResponse>({
    total_votes: 0,
    votes_negative: 0,
    votes_neutral: 0,
    votes_positive: 0,
  });

  const fetchResults = useCallback(async () => {
    if (!idea.hash_id) return;
    setLoading(true);
    const response = await getVoteResults(idea.hash_id);
    if (response.error) setError(response.error);
    if (!response.error && response.data) setNumVotes(response.data);
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
      if (!response.data) return;
      const category = response.data[0];
      setIcon(category.description_internal);
    });

  const getBgColor = () => {
    switch (phase) {
      case 40:
        return idea.is_winner ? 'for' : 'disabled';
      case 20:
        if (idea.approved === 1) return 'for';
        if (idea.approved === -1) return 'against';
        return 'disabled;';
      case 30:
        if (idea.approved < 0) return 'disabled';
        if (vote === 0) return phases[phase];
        if (vote === 1) return 'for';
        if (vote === -1) return 'against';
        if (!vote) return '';
      default:
        return phases[phase];
    }
  };

  useEffect(() => {
    setBgColor(getBgColor());
  }, [vote, phase]);

  useEffect(() => {
    getIcon();
    if (phase >= 30 && checkPermissions('ideas', 'vote')) fetchVote();
    if (phase >= 40) fetchResults();
  }, [phase]);

  const passedQuorum = () => {
    if (!!quorum) return (idea.sum_votes / idea.number_of_users) * 100 >= quorum;
    else return false;
  };

  return (
    <Grid
      size={{ xs: 12, sm: 6, md: 4 }}
      sx={{
        scrollSnapAlign: 'center',
        order:
          phase === 40
            ? idea.is_winner
              ? idea.sum_votes / idea.number_of_users
              : -(idea.sum_votes / numVotes.total_votes)
            : 0,
      }}
      order={-idea.approved}
    >
      <AppLink to={`idea/${idea.hash_id}`}>
        <Card
          sx={{
            borderRadius: '25px',
            overflow: 'hidden',
            scrollSnapAlign: 'center',
            bgcolor: `${bgColor}.main`,
            ...sx,
          }}
          variant="outlined"
          {...restOfProps}
        >
          <Stack direction="row" height={68} alignItems="center" color={disabled ? 'secondary.main' : ''}>
            <Stack pl={2}>
              {phase >= 40 ? (
                <AppIcon icon={Number(idea.is_winner) > 0 ? 'winner' : passedQuorum() ? 'for' : 'against'} size="xl" />
              ) : icon ? (
                <AppIcon icon={icon} />
              ) : (
                <></>
              )}
            </Stack>
            <Stack flexGrow={1} px={2} overflow="hidden">
              <Typography variant="h3" noWrap textOverflow="ellipsis" color="inherit">
                {idea.title}
              </Typography>
              {phase === 40 && !!vote && (
                <Typography variant="caption" fontSize="small" ml={0.5}>
                  {checkPermissions('ideas', 'vote')
                    ? t('votes.yourVote', { var: t(`votes.${votingOptions[vote + 1]}`) })
                    : ''}
                </Typography>
              )}
            </Stack>
            <Stack
              p={0.5}
              pl={2}
              borderLeft={`1px solid ${theme.palette.secondary.main}`}
              justifyContent="space-around"
              height="100%"
              sx={{ aspectRatio: 1 }}
            >
              {disabled ? (
                <AppIcon icon="rejected" />
              ) : phase === 10 ? (
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
                <>{typeof vote === 'number' && <AppIcon size="large" icon={votingOptions[vote + 1]} />}</>
              ) : (
                <>
                  {votingOptions.map((vote, i) => {
                    const voteCount = Object.values(numVotes)[i + 1];
                    return (
                      <Stack direction="row" alignItems="center" key={vote} order={-i}>
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
      </AppLink>
    </Grid>
  );
};

export default IdeaCard;
