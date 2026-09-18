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
  loading: boolean;
}

const EMPTY: VoteResultsState = {
  counts: { against: 0, neutral: 0, for: 0 },
  total: 0,
  voters: 0,
  loading: true,
};

/** The vote distribution on an idea, once voting is over. */
export const useVoteResults = (idea_id: string, enabled = true): VoteResultsState => {
  const [results, setResults] = useState<VoteResultsState>(EMPTY);

  useEffect(() => {
    if (!enabled) {
      setResults(EMPTY);
      return;
    }

    let active = true;
    setResults(EMPTY);
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
        loading: false,
      });
    });

    return () => {
      active = false;
    };
  }, [idea_id, enabled]);

  return results;
};
