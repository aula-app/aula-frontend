import { getUpdates } from '@/services/dashboard';
import { UpdateEvent } from '@/v2/components/update/groupUpdates';
import { UPDATE_VARIANTS } from '@/v2/components/update/UpdateCard/updateVariant';
import { useEffect, useState } from 'react';

interface UseUpdatesState {
  events: UpdateEvent[];
  isLoading: boolean;
  error: 'fetch' | 'generic' | null;
}

export const useUpdates = (): UseUpdatesState => {
  const [events, setEvents] = useState<UpdateEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<'fetch' | 'generic' | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await getUpdates(false);
        // error_code 2 means "nothing new" — a normal empty result, not an error.
        if ((response.error || response.error_code) && response.error_code !== 2) {
          setError('generic');
        } else {
          setEvents(
            UPDATE_VARIANTS.flatMap((variant) => (response.data?.[variant] ?? []).map((item) => ({ ...item, variant })))
          );
        }
      } catch {
        setError('fetch');
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  return { events, isLoading, error };
};
