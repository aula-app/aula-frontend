import { getUpdates } from '@/services/dashboard';
import { MESSAGES_CHANGED } from '@/v2/components/message/archiveMessage';
import { getInboxMessages } from '@/v2/components/message/getInboxMessages';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const loadMessageCount = async () => {
  const response = await getInboxMessages();
  // error_code 2 means "no messages" — a normal empty result, not an error.
  if (response.error_code === 2) return 0;
  return Array.isArray(response.data) ? response.data.length : undefined;
};

const loadUpdateCount = async () => (await getUpdates()).count ?? undefined;

/**
 * Refetched on every navigation, and on `refreshEvent` for changes made without one. Undefined on failure.
 */
const useCount = (load: () => Promise<number | undefined>, refreshEvent?: string) => {
  const { pathname } = useLocation();
  const [count, setCount] = useState<number>();
  const [refreshes, setRefreshes] = useState(0);

  useEffect(() => {
    if (!refreshEvent) return;
    const refresh = () => setRefreshes((n) => n + 1);
    window.addEventListener(refreshEvent, refresh);
    return () => window.removeEventListener(refreshEvent, refresh);
  }, [refreshEvent]);

  useEffect(() => {
    let active = true;
    load()
      .then((value) => active && setCount(value))
      .catch(() => active && setCount(undefined));
    return () => {
      active = false;
    };
  }, [load, pathname, refreshes]);

  return count;
};

/** Active messages in the user's inbox, the same list the Messages page shows. */
export const useMessageCount = () => useCount(loadMessageCount, MESSAGES_CHANGED);

export const useUpdateCount = () => useCount(loadUpdateCount);
