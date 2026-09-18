import { getIdeasByBox } from '@/services/ideas';
import { BoxType } from '@/types/Scopes';
import { useEffect, useState } from 'react';

export interface BoxApproval {
  /** Ideas that have been approved or rejected. */
  reviewed: number;
  total: number;
}

/**
 * Review progress per box, keyed by hash_id. The box list endpoint counts ideas but not their
 * approval, so the ideas are fetched per box — only while the approval phase is on screen.
 */
export const useBoxApprovals = (boxes: BoxType[], enabled: boolean): Record<string, BoxApproval> => {
  const [approvals, setApprovals] = useState<Record<string, BoxApproval>>({});
  const boxIds = boxes.map((box) => box.hash_id).join(',');

  useEffect(() => {
    if (!enabled || !boxIds) {
      setApprovals({});
      return;
    }

    let active = true;
    Promise.all(
      boxIds.split(',').map(async (hash_id): Promise<[string, BoxApproval]> => {
        const response = await getIdeasByBox({ topic_id: hash_id });
        const ideas = response.data || [];
        return [hash_id, { reviewed: ideas.filter((idea) => idea.approved !== 0).length, total: ideas.length }];
      })
    ).then((entries) => active && setApprovals(Object.fromEntries(entries)));

    return () => {
      active = false;
    };
  }, [boxIds, enabled]);

  return approvals;
};
