import { AppIcon, ScopeHeader } from '@/components';
import { CommentForms } from '@/components/DataForms';
import CommentBubble from '@/components/Idea/CommentBubble';
import IdeaBubbleSkeleton from '@/components/Idea/IdeaBubble/IdeaBubbleSkeleton';
import { useSearchAndSort, createTextFilter, useFilter } from '@/hooks';
import { deleteComment, getCommentsByIdea } from '@/services/comments';
import { CommentType } from '@/types/Scopes';
import { checkPermissions } from '@/utils';
import { Drawer, Fab, Stack } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
  const { idea_id, phase } = useParams<RouteParams>();

  // Manage search and sort state for comments
  const { searchQuery, sortKey, sortDirection, scopeHeaderProps } = useSearchAndSort({
    sortOptions: [
      { value: 'created', labelKey: 'settings.columns.created' },
      { value: 'sum_likes', labelKey: 'settings.columns.sum_likes' },
      { value: 'displayname', labelKey: 'settings.columns.displayname' },
    ],
  });

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [edit, setEdit] = useState<CommentType | boolean>(false);

  // Create filter function for comments (searches in content and displayname)
  const commentFilterFunction = useMemo(
    () => createTextFilter<CommentType>(['content', 'displayname']),
    []
  );

  // Apply filtering to comments
  const filteredComments = useFilter({
    data: comments,
    filterValue: searchQuery,
    filterFunction: commentFilterFunction,
  });

  const fetchComments = useCallback(async () => {
    if (!idea_id) return;
    setLoading(true);
    const response = await getCommentsByIdea(idea_id);
    if (response.error) setError(response.error);
    setComments(response.data || []);
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

  // Sort the filtered comments
  const sortedComments = useMemo(() => {
    return filteredComments.slice().sort((a, b) => {
      const valueA = a[sortKey as keyof CommentType];
      const valueB = b[sortKey as keyof CommentType];
      
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      }
      
      const comparison = String(valueA).localeCompare(String(valueB));
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredComments, sortKey, sortDirection]);

  return (
    <Stack alignItems="center" width="100%" spacing={2} pt={2}>
      {isLoading ? (
        <IdeaBubbleSkeleton />
      ) : comments.length > 0 ? (
        <>
          <ScopeHeader
            title={t('scopes.comments.plural')}
            scopeKey="comments"
            totalCount={comments.length}
            {...scopeHeaderProps}
          />
          <Stack width="100%" gap={2}>
            {sortedComments.map((comment) => (
              <CommentBubble
                key={comment.id}
                comment={comment}
                onEdit={() => setEdit(comment)}
                onDelete={() => onDelete(comment.id)}
                disabled={Number(phase) >= 20}
              />
            ))}
          </Stack>
        </>
      ) : null}
      {checkPermissions('comments', 'create') && idea_id && Number(phase) < 20 && (
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
      )}
      <Drawer anchor="bottom" open={!!edit} onClose={onClose} sx={{ overflowY: 'auto' }}>
        <CommentForms onClose={onClose} defaultValues={typeof edit !== 'boolean' ? edit : undefined} />
      </Drawer>
    </Stack>
  );
};

export default Comments;
