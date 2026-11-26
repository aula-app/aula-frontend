import { getBoxesByPhase } from '@/services/boxes';
import { BoxType } from '@/types/Scopes';
import { RoomPhases } from '@/types/SettingsTypes';
import { useEffect, useState } from 'react';

interface UseBoxesByRoomState {
  boxes: BoxType[];
  isLoading: boolean;
  error: 'fetch' | 'generic' | null;
  refetch: () => Promise<void>;
}

export const useBoxesByRoom = (
  room_id: string | undefined,
  phase: `${RoomPhases}`
): UseBoxesByRoomState => {
  const [boxes, setBoxes] = useState<BoxType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<'fetch' | 'generic' | null>(null);

  const fetch = async () => {
    if (!room_id) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const response = await getBoxesByPhase(Number(phase), room_id);
      // error_code 2 means "no boxes" — a normal empty result, not an error.
      if (response.error_code && response.error_code !== 2) {
        setError('generic');
      } else {
        setBoxes(response.data || []);
      }
    } catch (err) {
      setError('fetch');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [room_id, phase]);

  return { boxes, isLoading, error, refetch: fetch };
};
