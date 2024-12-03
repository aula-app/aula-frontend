import AppIcon from '@/components/AppIcon';
import MoreOptions from '@/components/MoreOptions';
import { CategoryType, IdeaType } from '@/types/Scopes';
import { checkPermissions, checkSelf, databaseRequest, phases } from '@/utils';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import IdeaContent from '../IdeaContent';

interface Props {
  idea: IdeaType;
  disabled?: boolean;
  onReload: () => void;
}

type likeMethodType = 'getLikeStatus' | 'IdeaAddLike' | 'IdeaRemoveLike';

const IdeaDocument = ({ idea, disabled = false, onReload }: Props) => {
  const [liked, setLiked] = useState(false);
  const [category, setCategory] = useState<CategoryType>();
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

  const hasLiked = async () => await manageLike('getLikeStatus').then((result) => setLiked(Boolean(result.data)));
  const addLike = async () => await manageLike(`IdeaAddLike`).then(() => onReload());
  const removeLike = async () => await manageLike(`IdeaRemoveLike`).then(() => onReload());

  const toggleLike = () => {
    liked ? removeLike() : addLike();
    setLiked(!liked);
  };

  useEffect(() => {
    hasLiked();
    getCategory();
  }, []);

  return (
    <Stack width="100%" sx={{ scrollSnapAlign: 'center' }} color="secondary" mb={2}>
      <Stack direction="row" justifyContent="space-between">
        {category ? (
          <Chip
            icon={<AppIcon icon={category.description_internal} size="small" sx={{ ml: 0.5 }} />}
            label={category.name}
            variant="outlined"
          />
        ) : (
          <Box></Box>
        )}{' '}
        <MoreOptions
          scope="ideas"
          item={idea}
          onClose={onReload}
          canEdit={checkPermissions(30) || (checkPermissions(20) && checkSelf(idea.user_id) && !disabled)}
        />
      </Stack>
      <IdeaContent idea={idea} />
      <Stack direction="row" alignItems="center" mt={2}>
        <AppIcon icon="account" size="xl" />
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
        <Button color="error" size="small" onClick={toggleLike} disabled={disabled}>
          <AppIcon icon={liked ? 'heartfull' : 'heart'} />
          {idea.sum_likes}
        </Button>
      </Stack>
    </Stack>
  );
};

export default IdeaDocument;
