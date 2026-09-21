import { getIdeasByBox } from '@/services/ideas';
import { IdeaType } from '@/types/Scopes';
import { useEffect, useState } from 'react';

interface UseIdeasByBoxState {
  ideas: IdeaType[];
  isLoading: boolean;
  error: 'fetch' | 'generic' | null;
  refetch: () => Promise<void>;
}

export const useIdeasByBox = (box_id: string | undefined): UseIdeasByBoxState => {
  const [ideas, setIdeas] = useState<IdeaType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<'fetch' | 'generic' | null>(null);

  const fetch = async () => {
    if (!box_id) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const response = await getIdeasByBox({ topic_id: box_id });
      // error_code 2 means "no ideas" — a normal empty result, not an error.
      if (response.error_code && response.error_code !== 2) {
        setError('generic');
      } else {
        setIdeas(response.data || []);
      }
    } catch (err) {
      setError('fetch');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [box_id]);

  return { ideas, isLoading, error, refetch: fetch };
};
