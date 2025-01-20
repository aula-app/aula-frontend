import AppIcon from '@/components/AppIcon';
import AppLink from '@/components/AppLink';
import ChatBubble from '@/components/ChatBubble';
import MoreOptions from '@/components/MoreOptions';
import UserAvatar from '@/components/UserAvatar';
import { CategoryType, IdeaType } from '@/types/Scopes';
import { CustomFieldsType } from '@/types/SettingsTypes';
import { checkPermissions, checkSelf, databaseRequest, getDisplayDate, phases } from '@/utils';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import IdeaContent from '../IdeaContent';

interface Props {
  idea: IdeaType;
  extraFields?: CustomFieldsType;
  comments?: number;
  to?: string;
  onReload: () => void;
}

type likeMethodType = 'getLikeStatus' | 'IdeaAddLike' | 'IdeaRemoveLike';

const IdeaBubble = ({ idea, comments = 0, extraFields, to, onReload }: Props) => {
  const { phase } = useParams();
  const [ideaState, setIdeaState] = useState<{
    liked: boolean;
    category?: CategoryType;
  }>({
    liked: false,
  });

  const manageLike = useCallback(
    (likeMethod: likeMethodType) => {
      return databaseRequest(
        {
          model: 'Idea',
          method: likeMethod,
          arguments: {
            idea_id: idea.id,
          },
        },
        ['user_id']
      );
    },
    [idea.id]
  );

  const getCategory = useCallback(async () => {
    const response = await databaseRequest({
      model: 'Idea',
      method: 'getIdeaCategory',
      arguments: {
        idea_id: idea.id,
      },
    });
    setIdeaState((prev) => ({
      ...prev,
      category: response.data || undefined,
    }));
  }, [idea.id]);

  const hasLiked = useCallback(async () => {
    const response = await manageLike('getLikeStatus');
    if (!response.success) return;
    setIdeaState((prev) => ({
      ...prev,
      liked: Boolean(response.data),
    }));
  }, [manageLike]);

  const toggleLike = useCallback(() => {
    const method = ideaState.liked ? 'IdeaRemoveLike' : 'IdeaAddLike';
    manageLike(method).then(() => {
      setIdeaState((prev) => ({
        ...prev,
        liked: !prev.liked,
      }));
      onReload();
    });
  }, [ideaState.liked, manageLike, onReload]);

  const onClose = useCallback(() => {
    onReload();
    getCategory();
  }, [onReload, getCategory]);

  useEffect(() => {
    Promise.all([hasLiked(), getCategory()]).catch(console.error);
  }, [hasLiked, getCategory]);

  return (
    <Stack width="100%" sx={{ scrollSnapAlign: 'center', mb: 2, mt: 1 }}>
      <ChatBubble color={`${phases[Number(phase)]}.main`}>
        <Stack>
          <Stack direction="row" justifyContent="space-between">
            {ideaState.category ? (
              <Chip
                icon={<AppIcon icon={ideaState.category.description_internal} size="xs" sx={{ ml: 0.5 }} />}
                label={ideaState.category.name}
                variant="outlined"
                color="secondary"
              />
            ) : (
              <Box></Box>
            )}
            <MoreOptions
              scope="ideas"
              item={idea}
              onClose={onClose}
              canEdit={checkPermissions(30) || (checkPermissions(20) && checkSelf(idea.user_id))}
            />
          </Stack>
          <AppLink to={to} disabled={!to}>
            <Stack gap={2}>
              <IdeaContent idea={idea} />
              {extraFields &&
                Object.entries(extraFields).map(([key, label]) => {
                  // Safe type casting for dynamic property access
                  const value = (idea as unknown as Record<string, unknown>)[key];
                  return value !== undefined ? (
                    <Stack key={key}>
                      <Typography variant="body2">
                        {label}: {String(value)}
                      </Typography>
                    </Stack>
                  ) : null;
                })}
              {/* <VotingQuorum
              phase={Number(phase) as RoomPhases}
              votes={Number(phase) > 30 ? Number(idea.number_of_votes) : Number(idea.sum_likes)}
              users={Number(idea.number_of_users)}
            /> */}
            </Stack>
          </AppLink>
        </Stack>
      </ChatBubble>
      <Stack direction="row" alignItems="center">
        <UserAvatar id={idea.user_id} update={true} />
        <Stack maxWidth="100%" overflow="hidden" ml={1} mr="auto">
          <Typography variant="caption" lineHeight={1.5}>
            {getDisplayDate(idea.created)}
          </Typography>
          <Typography
            variant="overline"
            overflow="hidden"
            textOverflow="ellipsis"
            fontWeight={700}
            lineHeight={1.5}
            maxWidth="100%"
          >
            {idea.displayname}
          </Typography>
        </Stack>
        {comments > 0 && (
          <AppLink to={to} disabled={!to}>
            <Stack direction="row" alignItems="center">
              <AppIcon icon="chat" sx={{ mr: 0.5 }} />
              {comments}
            </Stack>
          </AppLink>
        )}
        <Button color="error" size="small" onClick={toggleLike} disabled={!checkPermissions(20)}>
          <AppIcon icon={ideaState.liked ? 'heartfull' : 'heart'} sx={{ mr: 0.5 }} />
          {idea.sum_likes}
        </Button>
      </Stack>
    </Stack>
  );
};

export default IdeaBubble;
