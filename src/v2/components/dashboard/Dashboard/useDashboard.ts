import { getDashboard } from '@/services/dashboard';
import { PhaseCounts } from '@/v2/hooks/useRoomPhaseCounts';
import { useEffect, useState } from 'react';

interface UseDashboardState {
  /** The user's idea count per phase. Undefined while loading or after an error. */
  counts?: PhaseCounts;
  error: boolean;
}

export const useDashboard = (): UseDashboardState => {
  const [counts, setCounts] = useState<PhaseCounts>();
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    getDashboard()
      .then((response) => {
        if (!active) return;
        if (response.error || !response.data) setError(true);
        else setCounts(response.data.phase_counts as PhaseCounts);
      })
      .catch(() => active && setError(true));

    return () => {
      active = false;
    };
  }, []);

  return { counts, error };
};
