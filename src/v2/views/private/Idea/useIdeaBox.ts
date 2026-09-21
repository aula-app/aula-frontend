import { getBox } from '@/services/boxes';
import { getIdeaBoxes } from '@/services/ideas';
import { BoxType } from '@/types/Scopes';
import { useEffect, useState } from 'react';

interface UseIdeaBoxState {
  /** Null once settled means a wild idea — one that no box has picked up yet. */
  box: BoxType | null;
  isLoading: boolean;
}

/**
 * The box an idea sits in. `getIdeaTopic` only returns a name and id, so the box itself is
 * fetched for the phase — `getIdeaBaseData` carries no phase of its own.
 */
export const useIdeaBox = (idea_id: string | undefined): UseIdeaBoxState => {
  const [box, setBox] = useState<BoxType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!idea_id) {
      setIsLoading(false);
      return;
    }

    let active = true;
    setIsLoading(true);

    getIdeaBoxes(idea_id)
      .then(async (response) => {
        const hash_id = response.data?.[0]?.hash_id;
        if (!hash_id) return null;
        return (await getBox(hash_id)).data ?? null;
      })
      .then((result) => {
        if (!active) return;
        setBox(result);
        setIsLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setBox(null);
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [idea_id]);

  return { box, isLoading };
};
