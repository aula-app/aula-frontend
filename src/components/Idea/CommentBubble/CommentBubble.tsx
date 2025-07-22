import ChatBubble from '@/components/ChatBubble';
import MarkdownReader from '@/components/MarkdownReader';
import MoreOptions from '@/components/MoreOptions';
import { CommentType } from '@/types/Scopes';
import { Stack, StackProps } from '@mui/material';
import LikeButton from '../../Buttons/LikeButton';
import UserBar from '../UserBar';
import { useLocation } from 'react-router-dom';
import { checkPermissions } from '@/utils';

interface Props extends Omit<StackProps, 'children'> {
  comment: CommentType;
  onDelete: () => void;
  onEdit: () => void;
  disabled?: boolean;
}

const CommentBubble: React.FC<Props> = ({ comment, disabled = false, onDelete, onEdit, ...restOfProps }) => {
  const location = useLocation();

  return (
    <Stack data-testid="comment-bubble" width="100%" sx={{ scrollSnapAlign: 'center', mb: 2, mt: 1 }} {...restOfProps}>
      <ChatBubble disabled={disabled} comment>
        <Stack gap={1}>
          <MarkdownReader>{comment.content}</MarkdownReader>
        </Stack>
      </ChatBubble>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <UserBar info={comment} />
        <MoreOptions
          data-testid="comment-more-options"
          item={comment}
          scope="comments"
          onDelete={onDelete}
          onEdit={onEdit}
          link={location.pathname}
        >
          <LikeButton
            disabled={disabled || !checkPermissions('comments', 'like', comment.user_hash_id)}
            item={comment}
          />
        </MoreOptions>
      </Stack>
    </Stack>
  );
};

export default CommentBubble;
