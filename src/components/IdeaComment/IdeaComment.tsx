import { AccountCircle } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { IdeaBubble } from '../IdeaBubble';
import { Comment } from '@/types/CommentTypes';

interface Props {
  comment: Comment
}

export const WildIdea = ({ comment }: Props) => {
  return (
    <Stack>
      <IdeaBubble isComment text={comment.content} likes={0} />
      <Stack direction="row" alignItems="center" mt='-20px'>
        <AccountCircle sx={{ fontSize: '2em' }} />
        <Stack ml={1}>
          <Typography variant="caption" lineHeight={1.5}>
            {comment.created}
          </Typography>
          <Typography variant="overline" fontWeight={700} lineHeight={1.5}>
            {comment.user_id}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default WildIdea;
