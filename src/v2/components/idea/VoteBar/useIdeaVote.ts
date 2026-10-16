import { addVote } from '@/services/vote';
import { useAppStore } from '@/store';
import { Vote } from '@/utils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface VoteState {
  /** The user's current vote, or null where they have not voted yet. */
  vote: Vote | null;
  cast: (value: Vote) => Promise<void>;
  pending: boolean;
}

/**
 * The user's vote on one idea: optimistic, reverting and toasting on failure.
 * The stored vote is fetched by the surrounding list (`useIdeaVotes`) and passed
 * in, so opening an idea costs no extra request.
 */
export const useIdeaVote = (idea_id: string, stored: Vote | null | undefined): VoteState => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();
  const [vote, setVote] = useState<Vote | null>(stored ?? null);
  const [pending, setPending] = useState(false);

  useEffect(() => setVote(stored ?? null), [idea_id, stored]);

  const cast = async (value: Vote) => {
    if (pending || value === vote) return;

    const previous = vote;
    setVote(value);
    setPending(true);
    try {
      const response = await addVote(idea_id, value);
      if (response.error) {
        setVote(previous);
        dispatch({ type: 'ADD_TOAST', message: { message: t('errors.failed'), type: 'error' } });
      }
    } finally {
      setPending(false);
    }
  };

  return { vote, cast, pending };
};
