import { getQuorum } from '@/services/vote';
import { useEffect, useState } from 'react';

/** Configured quorum as a percentage of eligible users, or 0 when none is set. */
export const useQuorum = (phase: string | undefined): number => {
  const [quorum, setQuorum] = useState(0);

  useEffect(() => {
    let active = true;
    getQuorum().then((response) => {
      if (!active || !response.data) return;
      setQuorum(Number(Number(phase) >= 30 ? response.data.quorum_votes : response.data.quorum_wild_ideas) || 0);
    });
    return () => {
      active = false;
    };
  }, [phase]);

  return quorum;
};
