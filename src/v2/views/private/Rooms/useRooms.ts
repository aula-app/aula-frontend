import { getRooms } from '@/services/rooms';
import { RoomType } from '@/types/Scopes';
import { useEffect, useState } from 'react';

interface UseRoomsState {
  rooms: RoomType[];
  isLoading: boolean;
  error: 'fetch' | 'generic' | null;
  refetch: () => Promise<void>;
}

export const useRooms = (): UseRoomsState => {
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<'fetch' | 'generic' | null>(null);

  const fetch = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getRooms({ offset: 0, limit: 0, orderby: 0, asc: 0, type: -1, status: 1 });
      // error_code 2 means "no rooms" — a normal empty result, not an error.
      if (response.error_code && response.error_code !== 2) {
        setError('generic');
      } else {
        setRooms(response.data || []);
      }
    } catch (err) {
      setError('fetch');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { rooms, isLoading, error, refetch: fetch };
};
