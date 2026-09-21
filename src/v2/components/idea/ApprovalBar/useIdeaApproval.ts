import { setApprovalStatus } from '@/services/ideas';
import { useAppStore } from '@/store';
import { toVerdict, Verdict } from '@/utils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface ApprovalState {
  /** The moderator's decision, or null while nobody has ruled on the idea. */
  approved: Verdict | null;
  /** The argument behind a rejection. Empty on an approved idea. */
  comment: string;
  decide: (value: Verdict, comment?: string) => Promise<void>;
  pending: boolean;
}

/** An idea's approval-phase decision: optimistic, reverting and toasting on failure. */
export const useIdeaApproval = (
  idea_id: string,
  approved: unknown,
  approval_comment?: string | null
): ApprovalState => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();
  const [decision, setDecision] = useState({ approved: toVerdict(approved), comment: approval_comment ?? '' });
  const [pending, setPending] = useState(false);

  useEffect(
    () => setDecision({ approved: toVerdict(approved), comment: approval_comment ?? '' }),
    [idea_id, approved, approval_comment]
  );

  const decide = async (value: Verdict, comment = '') => {
    if (pending) return;

    const previous = decision;
    setDecision({ approved: value, comment });
    setPending(true);
    try {
      const response = await setApprovalStatus({ idea_id, approved: value, approval_comment: comment });
      if (response.error) {
        setDecision(previous);
        dispatch({ type: 'ADD_TOAST', message: { message: t('errors.failed'), type: 'error' } });
      }
    } finally {
      setPending(false);
    }
  };

  return { ...decision, decide, pending };
};
