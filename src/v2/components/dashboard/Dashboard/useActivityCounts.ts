import { getUpdates } from '@/services/dashboard';
import { getPersonalMessages } from '@/services/messages';
import { useEffect, useState } from 'react';

interface ActivityCounts {
  messages?: number;
  updates?: number;
}

/** The user's personal message and update counts. Each stays undefined if its request fails. */
export const useActivityCounts = (): ActivityCounts => {
  const [counts, setCounts] = useState<ActivityCounts>({});

  useEffect(() => {
    let active = true;

    Promise.allSettled([getPersonalMessages(), getUpdates()]).then(([messages, updates]) => {
      if (!active) return;
      setCounts({
        messages:
          messages.status === 'fulfilled' && Array.isArray(messages.value.data)
            ? messages.value.data.length
            : undefined,
        updates: updates.status === 'fulfilled' ? (updates.value.count ?? undefined) : undefined,
      });
    });

    return () => {
      active = false;
    };
  }, []);

  return counts;
};
