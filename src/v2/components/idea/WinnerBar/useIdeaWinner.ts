import { setToLosing, setToWinning } from '@/services/vote';
import { useAppStore } from '@/store';
import { toVerdict, Verdict } from '@/utils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface WinnerState {
  winner: Verdict | null;
  decide: (value: Verdict) => Promise<void>;
  pending: boolean;
}

/** An idea's results-phase verdict: optimistic, reverting and toasting on failure. */
export const useIdeaWinner = (idea_id: string, stored: unknown): WinnerState => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();
  const [winner, setWinner] = useState<Verdict | null>(toVerdict(stored));
  const [pending, setPending] = useState(false);

  useEffect(() => setWinner(toVerdict(stored)), [idea_id, stored]);

  const decide = async (value: Verdict) => {
    if (pending || value === winner) return;

    const previous = winner;
    setWinner(value);
    setPending(true);
    try {
      const response = value === 1 ? await setToWinning(idea_id) : await setToLosing(idea_id);
      if (response.error) {
        setWinner(previous);
        dispatch({ type: 'ADD_TOAST', message: { message: t('errors.failed'), type: 'error' } });
      }
    } finally {
      setPending(false);
    }
  };

  return { winner, decide, pending };
};
