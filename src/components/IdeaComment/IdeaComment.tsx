import { IdeaBubble } from '../IdeaBubble';
import { Stack, Typography } from '@mui/material';
import { CommentType } from '@/types/CommentTypes';
import { grey } from '@mui/material/colors';
import AppIcon from '../AppIcon';

interface Props {
  comment: CommentType;
  disabled?: boolean;
  onReload: () => void;
}

export const IdeaComment = ({ comment, onReload, disabled = false }: Props) => {
  return (
    <Stack mb={2} sx={{color: disabled ? grey[600] : grey[800]}}>
      <IdeaBubble bubbleInfo={comment} id={comment.id} onReload={onReload} disabled={disabled} isComment />
      <Stack direction="row" alignItems="center" mt="-20px" >
        <AppIcon name="account" />
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

export default IdeaComment;
