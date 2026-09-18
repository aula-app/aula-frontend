import { getQuorum } from '@/services/vote';
import { useEffect, useState } from 'react';

const APPROVAL = 20;
const VOTING = 30;

/** Configured quorum as a percentage of eligible users, or 0 when the phase has none. */
export const useQuorum = (phase: string | undefined): number => {
  const [quorum, setQuorum] = useState(0);

  useEffect(() => {
    if (Number(phase) === APPROVAL) {
      setQuorum(0);
      return;
    }

    let active = true;
    getQuorum().then((response) => {
      if (!active || !response.data) return;
      const configured = Number(phase) >= VOTING ? response.data.quorum_votes : response.data.quorum_wild_ideas;
      setQuorum(Number(configured) || 0);
    });
    return () => {
      active = false;
    };
  }, [phase]);

  return quorum;
};
