import ChatBubble from '@/components/ChatBubble';
import { CommentType } from '@/types/Scopes';
import { Box, Stack, Typography } from '@mui/material';
import UserBar from '../UserBar';
import MoreOptions from '@/components/MoreOptions';
import LikeButton from '../LikeButton';
import { checkPermissions, checkSelf } from '@/utils';
import MarkdownReader from '@/components/MarkdownReader';

interface Props {
  comment: CommentType;
  onDelete: () => void;
  onEdit: () => void;
  disabled?: boolean;
}

const CommentBubble: React.FC<Props> = ({ comment, disabled = false, onDelete, onEdit }) => {
  return (
    <Stack width="100%" sx={{ scrollSnapAlign: 'center', mb: 2, mt: 1 }}>
      <ChatBubble disabled={disabled} comment>
        <Stack gap={1}>
          <MarkdownReader>{comment.content}</MarkdownReader>
        </Stack>
      </ChatBubble>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <UserBar info={comment} />
        <MoreOptions
          item={comment}
          scope="comments"
          onDelete={onDelete}
          onEdit={onEdit}
          canEdit={checkPermissions(30) || (checkPermissions(20) && checkSelf(comment.user_id) && !disabled)}
        >
          <LikeButton disabled={disabled} item={comment} />
        </MoreOptions>
      </Stack>
    </Stack>
  );
};

export default CommentBubble;
