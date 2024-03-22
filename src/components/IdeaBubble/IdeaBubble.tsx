import { CommentType } from '@/types/CommentTypes';
import { IdeaType } from '@/types/IdeaTypes';
import { localStorageGet } from '@/utils';
import { parseJwt } from '@/utils/jwt';
import { databaseRequest } from '@/utils/requests';
import { ChatBubble, Favorite } from '@mui/icons-material';
import { Box, Button, Stack, Typography, colors } from '@mui/material';
import { useEffect, useState } from 'react';

interface IdeaBubbleProps {
  id: number;
  bubbleInfo: IdeaType | CommentType;
  comments?: number;
  liked?: boolean;
  disabled?: boolean;
  onReload: () => void;
}
type likeMethodType = 'getLikeStatus' | 'IdeaAddLike' | 'IdeaRemoveLike' | 'CommentAddLike' | 'CommentRemoveLike';
type Args = {user_id: number, idea_id?: number, comment_id?: number}
const bubbleColor = '#eee';

export const IdeaBubble = ({ bubbleInfo, id, comments = 0, disabled = false, onReload}: IdeaBubbleProps) => {
  const jwt_token = localStorageGet('token');
  const jwt_payload = parseJwt(jwt_token);
  const [liked, setLiked] = useState(false);

  const context = (bubbleInfo.hasOwnProperty('idea_id') ? 'Comment' : 'Idea') // check if it is a comment
  const lowerContext = context.toLowerCase() as  'comment' | 'idea';

  const manageLike = (likeMethod: likeMethodType) => {
    const args = { user_id: jwt_payload.user_id } as Args;
    args[`${lowerContext}_id`] = id;
    return databaseRequest('model', {
      model: context,
      method: likeMethod,
      arguments: args,
      decrypt: [],
    });
  };

  const hasLiked = async () => await manageLike('getLikeStatus').then((result) => setLiked(Boolean(result.data)));
  const addLike = async () => await manageLike(`${context}AddLike`).then(() => onReload());
  const removeLike = async () => await manageLike(`${context}RemoveLike`).then(() => onReload());

  const toggleLike = () => {
    liked ? removeLike() : addLike();
    setLiked(!liked);
  };

  useEffect(() => {
    hasLiked();
  }, []);

  return (
    <Stack mb={1}>
      <Box sx={{ background: bubbleColor, p: 2, borderRadius: 1, position: 'relative' }}>
        <Box
          className="noPrint"
          sx={{
            position: 'absolute',
            bottom: 0,
            left: '25px',
            border: `8px solid ${bubbleColor}`,
            borderBottomColor: 'transparent',
            borderRightColor: 'transparent',
            transformOrigin: 'bottom left',
            transform: 'translateY(100%)',
          }}
        />
        {/* {title && (
          <Typography variant="h6" textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap" mb={1}>
            {title}
          </Typography>
        )} */}
        {bubbleInfo.content}
      </Box>
      <Stack direction="row" justifyContent="flex-end" alignItems="center">
        {comments > 0 && (
          <>
            <Button color="secondary" sx={{ px: 0, minWidth: 40 }}>
              <ChatBubble fontSize="small" />
              <Typography variant="caption" pl={0.3}>
                {comments}
              </Typography>
            </Button>
          </>
        )}
        <Button
          disabled={disabled}
          color={liked ? 'primary' : 'secondary'}
          sx={{ px: 0, minWidth: 40 }}
          onClick={toggleLike}>
          <Favorite fontSize="small" />
          <Typography variant="caption" pl={0.3}>
            {bubbleInfo.sum_likes}
          </Typography>
        </Button>
      </Stack>
    </Stack>
  );
};

export default IdeaBubble;
