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
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    if (!room_id) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const response = await getIdeasByRoom(room_id);
      if (response.error) {
        setError(response.error);
      } else {
        setIdeas(response.data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ideas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [room_id]);

  return { ideas, isLoading, error, refetch: fetch };
};
