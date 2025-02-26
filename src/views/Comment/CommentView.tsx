import { AppIcon } from '@/components';
import { CommentForms } from '@/components/DataForms';
import CommentBubble from '@/components/Idea/CommentBubble';
import IdeaBubbleSkeleton from '@/components/Idea/IdeaBubble/IdeaBubbleSkeleton';
import KnowMore from '@/components/KnowMore';
import { deleteComment, getCommentsByIdea } from '@/services/comments';
import { CommentType } from '@/types/Scopes';
import { checkPermissions } from '@/utils';
import { Box, Drawer, Fab, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

interface RouteParams extends Record<string, string | undefined> {
  room_id: string;
}

/**
 * Comments component displays a list of ideas for a specific room.
 * Users with appropriate permissions can add new ideas.
 *
 * @component
 * @url /room/:room_id/ideas
 */
const Comments = () => {
  const { t } = useTranslation();
  const { idea_id, phase, room_id } = useParams<RouteParams>();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [edit, setEdit] = useState<CommentType | boolean>(false); // false = update dialog closed ;true = new idea; CommentFormData = edit idea;

  const fetchComments = useCallback(async () => {
    if (!idea_id) return;
    setLoading(true);
    const response = await getCommentsByIdea(idea_id);
    if (response.error) setError(response.error);
    if (!response.error) setComments(response.data || []);
    setLoading(false);
  }, [idea_id]);

  useEffect(() => {
    fetchComments();
  }, [idea_id]);

  const onDelete = async (id: number) => {
    const request = await deleteComment(id);
    if (!request.error) onClose();
  };

  const onClose = () => {
    setEdit(false);
    fetchComments();
  };

  return (
    <Stack alignItems="center" width="100%" spacing={2} pt={2}>
      {comments.length > 0 && (
        <Box pl={1} width="100%">
          <KnowMore title={t('tooltips.comment')}>
            <Typography variant="h6">
              {String(comments.length)} {t('scopes.comments.plural')}
            </Typography>
          </KnowMore>
        </Box>
      )}
      {isLoading && <IdeaBubbleSkeleton />}
      {error && <Typography>{t(error)}</Typography>}
      {!isLoading &&
        comments.map((comment) => (
          <CommentBubble
            key={comment.id}
            comment={comment}
            onEdit={() => setEdit(comment)}
            onDelete={() => onDelete(comment.id)}
            disabled={Number(phase) >= 20}
          />
        ))}
      {checkPermissions('comments', 'create') && idea_id && Number(phase) < 20 && (
        <>
          <Fab
            aria-label="add comment"
            color="primary"
            sx={{
              position: 'fixed',
              bottom: 40,
              zIndex: 1000,
            }}
            onClick={() => setEdit(true)}
          >
            <AppIcon icon="comment" />
          </Fab>
          <Drawer anchor="bottom" open={!!edit} onClose={onClose} sx={{ overflowY: 'auto' }}>
            <CommentForms onClose={onClose} defaultValues={typeof edit !== 'boolean' ? edit : undefined} />
          </Drawer>
        </>
      )}
    </Stack>
  );
};

export default Comments;
