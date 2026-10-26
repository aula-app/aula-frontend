import { getUpdates } from '@/services/dashboard';
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

/** Refetched on every navigation, so it catches up once something is read or archived. Undefined on failure. */
const useCount = (load: () => Promise<number | undefined>) => {
  const { pathname } = useLocation();
  const [count, setCount] = useState<number>();

  useEffect(() => {
    let active = true;
    load()
      .then((value) => active && setCount(value))
      .catch(() => active && setCount(undefined));
    return () => {
      active = false;
    };
  }, [load, pathname]);

  return count;
};

/** Active messages in the user's inbox, the same list the Messages page shows. */
export const useMessageCount = () => useCount(loadMessageCount);

export const useUpdateCount = () => useCount(loadUpdateCount);
