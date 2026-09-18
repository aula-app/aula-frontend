import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store';

export interface LikeState {
  liked: boolean;
  count: number;
  toggle: () => Promise<void>;
  pending: boolean;
}

interface UseLikeOptions {
  /** Identity of the liked item. The initial status is refetched when it changes. */
  id: string | number;
  /** Like count as the server reports it, already reflecting the stored status. */
  sumLikes: number;
  getStatus: () => Promise<boolean>;
  add: () => Promise<{ error?: string | null }>;
  remove: () => Promise<{ error?: string | null }>;
}

/**
 * Like state for any likeable item: fetches the user's stored status, exposes an
 * optimistic count and a toggle that reverts and toasts on failure.
 */
export const useLike = ({ id, sumLikes, getStatus, add, remove }: UseLikeOptions): LikeState => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();
  // `initial` is the status returned by the server (already reflected in
  // sumLikes); `liked` is the current, optimistic status.
  const [initial, setInitial] = useState(false);
  const [liked, setLiked] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let active = true;
    getStatus().then((status) => {
      if (!active) return;
      setInitial(status);
      setLiked(status);
    });
    return () => {
      active = false;
    };
  }, [id]);

  const count = sumLikes + Number(liked) - Number(initial);

  const toggle = async () => {
    if (pending) return;
    const next = !liked;
    setLiked(next);
    setPending(true);
    try {
      const response = await (next ? add() : remove());
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
