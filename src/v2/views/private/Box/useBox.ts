import { getBox } from '@/services/boxes';
import { BoxType } from '@/types/Scopes';
import { useEffect, useState } from 'react';

interface UseBoxState {
  box: BoxType | null;
  isLoading: boolean;
  error: 'fetch' | 'generic' | null;
  /** Resolves to the freshly fetched box, or null when it no longer exists. */
  refetch: () => Promise<BoxType | null>;
}

export const useBox = (box_id: string | undefined): UseBoxState => {
  const [box, setBox] = useState<BoxType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<'fetch' | 'generic' | null>(null);

  const fetch = async (): Promise<BoxType | null> => {
    if (!box_id) {
      setIsLoading(false);
      return null;
    }
    try {
      setIsLoading(true);
      setError(null);
      const response = await getBox(box_id);
      if (response.error || !response.data) {
        setError('generic');
        setBox(null);
        return null;
      }
      setBox(response.data);
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
  }, [box_id]);

  return { box, isLoading, error, refetch: fetch };
};
