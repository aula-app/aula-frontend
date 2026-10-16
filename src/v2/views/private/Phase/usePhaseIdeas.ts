import { getWildIdeasByUser } from '@/services/dashboard';
import { getUserIdeasByPhase } from '@/services/ideas';
import { IdeaType } from '@/types/Scopes';
import { RoomPhases } from '@/types/SettingsTypes';
import { useEffect, useState } from 'react';

interface UsePhaseIdeasState {
  ideas: IdeaType[];
  isLoading: boolean;
  error: 'fetch' | 'generic' | null;
  refetch: () => Promise<void>;
}

/** The current user's ideas in a phase, across all of their rooms. */
export const usePhaseIdeas = (phase: `${RoomPhases}`): UsePhaseIdeasState => {
  const [ideas, setIdeas] = useState<IdeaType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<'fetch' | 'generic' | null>(null);

  const fetch = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = phase === '0' ? await getWildIdeasByUser() : await getUserIdeasByPhase(Number(phase));
      // error_code 2 means "no ideas" — a normal empty result, not an error.
      if ((response.error || response.error_code) && response.error_code !== 2) {
        setError('generic');
      } else {
        setIdeas(response.data || []);
      }
    } catch {
      setError('fetch');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [phase]);

  return { ideas, isLoading, error, refetch: fetch };
};
