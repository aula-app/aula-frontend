import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { addIdeaLike, getIdeaLike, removeIdeaLike } from '@/services/ideas';
import { useAppStore } from '@/store';
import { IdeaType } from '@/types/Scopes';

/**
 * Encapsulates the like state for an idea: fetches the user's initial status,
 * exposes an optimistic count and a toggle that reverts on failure.
 */
export const useIdeaLike = (idea: IdeaType) => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();
  // `initial` is the status returned by the server (already reflected in
  // idea.sum_likes); `liked` is the current, optimistic status.
  const [initial, setInitial] = useState(false);
  const [liked, setLiked] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let active = true;
    getIdeaLike(idea.hash_id).then((status) => {
      if (!active) return;
      setInitial(status);
      setLiked(status);
    });
    return () => {
      active = false;
    };
  }, [idea.hash_id]);

  const count = idea.sum_likes + Number(liked) - Number(initial);

  const toggle = async () => {
    if (pending) return;
    const next = !liked;
    setLiked(next);
    setPending(true);
    try {
      const response = await (next ? addIdeaLike(idea.hash_id) : removeIdeaLike(idea.hash_id));
      if (response.error) {
        setLiked(!next); // revert on failure
        dispatch({ type: 'ADD_TOAST', message: { message: t('errors.failed'), type: 'error' } });
      }
    } finally {
      setPending(false);
    }
  };

  return { liked, count, toggle, pending };
};
