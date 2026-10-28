import { getVoteResults } from '@/services/vote';
import { votingOptions } from '@/utils';
import { useEffect, useState } from 'react';

export interface VoteResultsState {
  /** Weighted votes cast, per option. */
  counts: Record<(typeof votingOptions)[number], number>;
  /** Total weight cast. */
  total: number;
  /** Eligible voters, as the endpoint counts them: room members plus the roles that vote everywhere. */
  voters: number;
}

/** The vote distribution on an idea, or null until the counts are in. */
export const useVoteResults = (idea_id: string, enabled = true): VoteResultsState | null => {
  const [results, setResults] = useState<VoteResultsState | null>(null);

  useEffect(() => {
    setResults(null);
    if (!enabled) return;

    let active = true;
    getVoteResults(idea_id).then(({ data }) => {
      if (!active) return;
      // An idea nobody voted on comes back with no data at all, which is itself a result: all zeros.
      setResults({
        counts: {
          against: Number(data?.votes_negative) || 0,
          neutral: Number(data?.votes_neutral) || 0,
          for: Number(data?.votes_positive) || 0,
        },
        total: Number(data?.total_votes) || 0,
        voters: Number(data?.voters_count) || 0,
      });
    });

    return () => {
      active = false;
    };
  }, [idea_id, enabled]);

  return results;
};
