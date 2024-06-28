import { Button, Stack, Typography } from '@mui/material';
import AppIcon from '../AppIcon';
import ChatBubble from '../ChatBubble';
import { grey } from '@mui/material/colors';
import { CommentType } from '@/types/CommentTypes';
import { databaseRequest, localStorageGet, parseJwt } from '@/utils';
import { useEffect, useState } from 'react';
import MoreOptions from '../MoreOptions';

interface Props {
  comment: CommentType;
  onReload: () => void;
  disabled?: boolean;
}

type likeMethodType = 'getLikeStatus' | 'CommentAddLike' | 'CommentRemoveLike';

export const Comment = ({ comment, disabled = false, onReload }: Props) => {
  const jwt_token = localStorageGet('token');
  const jwt_payload = parseJwt(jwt_token);
  const [liked, setLiked] = useState(false);
  const displayDate = new Date(comment.created);

  const manageLike = (likeMethod: likeMethodType) => {
    return databaseRequest('model', {
      model: 'Comment',
      method: likeMethod,
      arguments: {
        user_id: jwt_payload.user_id,
        comment_id: comment.id,
      },
    });
  };

  const hasLiked = async () => await manageLike('getLikeStatus').then((result) => setLiked(Boolean(result.data)));
  const addLike = async () => await manageLike(`CommentAddLike`).then(() => onReload());
  const removeLike = async () => await manageLike(`CommentRemoveLike`).then(() => onReload());

  const toggleLike = () => {
    liked ? removeLike() : addLike();
    setLiked(!liked);
  };

  useEffect(() => {
    hasLiked();
  }, []);

  return (
    <Stack width="100%" sx={{ scrollSnapAlign: 'center', mb: 2, mt: 1 }}>
      <ChatBubble color={grey[200]} disabled={disabled}>
        <Stack>
          <Typography>{comment.content}</Typography>
          <Stack direction="row" justifyContent="end">
            <MoreOptions />
          </Stack>
        </Stack>
      </ChatBubble>
      <Stack direction="row" alignItems="center">
        <AppIcon name="account" size="large" />
        <Stack maxWidth="100%" overflow="hidden" ml={2} mr="auto">
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
            {comment.username}
          </Typography>
        </Stack>
        <Button color="error" size="small" onClick={toggleLike} disabled={disabled}>
          <AppIcon name={liked ? 'heartfull' : 'heart'} sx={{ mr: 0.5 }} />
          {comment.sum_likes}
        </Button>
      </Stack>
    </Stack>
  );
};

export default Comment;
