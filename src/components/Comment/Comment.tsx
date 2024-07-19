import { CommentType } from '@/types/Scopes';
import { databaseRequest } from '@/utils';
import { Button, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useEffect, useState } from 'react';
import AppIcon from '../AppIcon';
import ChatBubble from '../ChatBubble';
import MoreOptions from '../MoreOptions';

interface Props {
  comment: CommentType;
  onReload: () => void;
  disabled?: boolean;
}

type likeMethodType = 'getLikeStatus' | 'CommentAddLike' | 'CommentRemoveLike';

export const Comment = ({ comment, disabled = false, onReload }: Props) => {
  const [liked, setLiked] = useState(false);
  const displayDate = new Date(comment.created);

  const manageLike = (likeMethod: likeMethodType) => {
    return databaseRequest(
      {
        model: 'Comment',
        method: likeMethod,
        arguments: {
          comment_id: comment.id,
        },
      },
      ['user_id']
    );
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
            <MoreOptions scope="comments" id={comment.id} onClose={onReload} />
          </Stack>
        </Stack>
      </ChatBubble>
      <Stack direction="row" alignItems="center">
        <AppIcon icon="account" size="large" />
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
          <AppIcon icon={liked ? 'heartfull' : 'heart'} sx={{ mr: 0.5 }} />
          {comment.sum_likes}
        </Button>
      </Stack>
    </Stack>
  );
};

export default Comment;
