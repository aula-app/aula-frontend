import { getIdea } from '@/services/ideas';
import { IdeaType } from '@/types/Scopes';
import { useEffect, useState } from 'react';

interface UseIdeaState {
  idea: IdeaType | null;
  isLoading: boolean;
  error: 'fetch' | 'generic' | null;
  /** Resolves to the freshly fetched idea, or null when it no longer exists. */
  refetch: () => Promise<IdeaType | null>;
}

export const useIdea = (idea_id: string | undefined): UseIdeaState => {
  const [idea, setIdea] = useState<IdeaType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<'fetch' | 'generic' | null>(null);

  const fetch = async (): Promise<IdeaType | null> => {
    if (!idea_id) {
      setIsLoading(false);
      return null;
    }
    try {
      setIsLoading(true);
      setError(null);
      const response = await getIdea(idea_id);
      if (response.error || !response.data) {
        setError('generic');
        setIdea(null);
        return null;
      }
      setIdea(response.data);
      return response.data;
    } catch (err) {
      setError('fetch');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [idea_id]);

  return { idea, isLoading, error, refetch: fetch };
};
