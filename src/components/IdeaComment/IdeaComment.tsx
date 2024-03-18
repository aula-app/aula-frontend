import { AccountCircle } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { IdeaBubble } from '../IdeaBubble';
import { CommentType } from '@/types/CommentTypes';

interface Props {
  comment: CommentType;
  onReload: () => void;
}

export const Idea = ({ comment, onReload }: Props) => {
  return (
    <Stack>
      <IdeaBubble bubbleInfo={comment} id={comment.id} onReload={onReload} />
      <Stack direction="row" alignItems="center" mt="-20px">
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

export default Idea;
