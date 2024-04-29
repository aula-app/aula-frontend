import { IdeaBubble } from '../IdeaBubble';
import { AccountCircle } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { CommentType } from '@/types/CommentTypes';

interface Props {
  comment: CommentType;
  disabled?: boolean;
  onReload: () => void;
}

export const Idea = ({ comment, onReload, disabled = false }: Props) => {
  return (
    <Stack mb={1}>
      <IdeaBubble bubbleInfo={comment} id={comment.id} onReload={onReload} disabled={disabled} />
      <Stack direction="row" alignItems="center" mt="-20px">
        <AccountCircle sx={{ fontSize: '2em' }} />
        <Stack ml={1}>
          <Typography variant="caption" lineHeight={1.5}>
            {comment.created}
          </Typography>
          <Typography variant="overline" fontWeight={700} lineHeight={1.5}>
            {comment.username}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Idea;
