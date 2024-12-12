import { CategoryType, IdeaType } from '@/types/Scopes';
import { checkPermissions, checkSelf, databaseRequest, localStorageGet, parseJwt, phases } from '@/utils';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import AppIcon from '@/components/AppIcon';
import AppLink from '@/components/AppLink';
import ChatBubble from '@/components/ChatBubble';
import MoreOptions from '@/components/MoreOptions';
import UserAvatar from '@/components/UserAvatar';
import { CustomFieldsType, RoomPhases } from '@/types/SettingsTypes';
import IdeaContent from '../IdeaContent';
import VotingQuorum from '../VotingQuorum';
import { useParams } from 'react-router-dom';

interface Props {
  idea: IdeaType;
  comments?: number;
  to?: string;
  onReload: () => void;
}

type likeMethodType = 'getLikeStatus' | 'IdeaAddLike' | 'IdeaRemoveLike';

const IdeaBubble = ({ idea, comments = 0, to, onReload }: Props) => {
  const { phase } = useParams();
  const [liked, setLiked] = useState(false);
  const [category, setCategory] = useState<CategoryType>();
  const [fields, setFields] = useState<CustomFieldsType>({
    custom_field1: null,
    custom_field2: null,
  });
  const displayDate = new Date(idea.created);

  const manageLike = (likeMethod: likeMethodType) => {
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
  };

  const getCategory = async () =>
    await databaseRequest({
      model: 'Idea',
      method: 'getIdeaCategory',
      arguments: {
        idea_id: idea.id,
      },
    }).then((response) => (response.data ? setCategory(response.data) : setCategory(undefined)));

  async function getFields() {
    await databaseRequest({
      model: 'Settings',
      method: 'getCustomfields',
      arguments: {},
    }).then((response) => {
      if (response.success)
        setFields({
          custom_field1: response.data.custom_field1_name,
          custom_field2: response.data.custom_field2_name,
        });
    });
  }

  const hasLiked = async () =>
    await manageLike('getLikeStatus').then((response) => {
      if (!response.success) return;
      setLiked(Boolean(response.data));
    });
  const addLike = async () => await manageLike('IdeaAddLike').then(() => onReload());
  const removeLike = async () => await manageLike('IdeaRemoveLike').then(() => onReload());

  const toggleLike = () => {
    liked ? removeLike() : addLike();
    setLiked(!liked);
  };

  const onClose = () => {
    onReload();
    getCategory();
  };

  useEffect(() => {
    hasLiked();
    getCategory();
    getFields();
  }, []);

  return (
    <Stack width="100%" sx={{ scrollSnapAlign: 'center', mb: 2, mt: 1 }}>
      <ChatBubble color={`${phases[Number(phase)]}.main`}>
        <Stack>
          <Stack direction="row" justifyContent="space-between">
            {category ? (
              <Chip
                icon={<AppIcon icon={category.description_internal} size="xs" sx={{ ml: 0.5 }} />}
                label={category.name}
                variant="outlined"
                color="secondary"
              />
            ) : (
              <Box></Box>
            )}
            <MoreOptions
              scope="ideas"
              id={idea.id}
              onClose={onClose}
              canEdit={checkPermissions(30) || (checkPermissions(20) && checkSelf(idea.user_id))}
            />
          </Stack>
          <AppLink component={Stack} to={to} disabled={!to} gap={2}>
            <IdeaContent idea={idea} />
            <VotingQuorum
              phase={Number(phase) as RoomPhases}
              votes={Number(phase) > 30 ? Number(idea.number_of_votes) : Number(idea.sum_likes)}
              users={Number(idea.number_of_users)}
            />
          </AppLink>
        </Stack>
      </ChatBubble>
      <Stack direction="row" alignItems="center">
        <UserAvatar id={idea.user_id} update={true} />
        <Stack maxWidth="100%" overflow="hidden" ml={1} mr="auto">
          {displayDate && (
            <Typography variant="caption" lineHeight={1.5}>
              {displayDate.getFullYear()}/{displayDate.getMonth()}/{displayDate.getDate()}
            </Typography>
          )}
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
          <AppIcon icon={liked ? 'heartfull' : 'heart'} sx={{ mr: 0.5 }} />
          {idea.sum_likes}
        </Button>
      </Stack>
    </Stack>
  );
};

export default IdeaBubble;
