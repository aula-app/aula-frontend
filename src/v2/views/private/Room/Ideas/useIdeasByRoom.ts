import { getIdeasByRoom } from '@/services/ideas';
import { IdeaType } from '@/types/Scopes';
import { useEffect, useState } from 'react';

interface UseIdeasByRoomState {
  ideas: IdeaType[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useIdeasByRoom = (room_id: string | undefined): UseIdeasByRoomState => {
  const [ideas, setIdeas] = useState<IdeaType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<'empty' | 'fetch' | 'generic' | null>(null);

  const fetch = async () => {
    if (!room_id) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const response = await getIdeasByRoom(room_id);
      if (response.error_code) {
        response.error_code === 2 ? setError('empty') : setError('generic');
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
  }, [room_id]);

  return { ideas, isLoading, error, refetch: fetch };
};
