import { getCommentsByIdea } from '@/services/comments';
import { CommentType } from '@/types/Scopes';
import { useEffect, useState } from 'react';

interface UseCommentsState {
  comments: CommentType[];
  isLoading: boolean;
  error: 'fetch' | 'generic' | null;
  refetch: () => Promise<void>;
}

export const useComments = (idea_id: string | undefined): UseCommentsState => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<'fetch' | 'generic' | null>(null);

  const fetch = async () => {
    if (!idea_id) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const response = await getCommentsByIdea(idea_id);
      // error_code 2 means "no comments" — a normal empty result, not an error.
      if (response.error_code && response.error_code !== 2) {
        setError('generic');
      } else {
        setComments(response.data || []);
      }
    } catch (err) {
      setError('fetch');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [idea_id]);

  return { comments, isLoading, error, refetch: fetch };
};
