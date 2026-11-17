import { MessageType } from '@/types/Scopes';
import { getInboxMessages, InboxStatus } from '@/v2/components/message/getInboxMessages';
import { useCallback, useEffect, useState } from 'react';

interface UseMessagesState {
  messages: MessageType[];
  isLoading: boolean;
  error: 'fetch' | 'generic' | null;
  refetch: () => Promise<void>;
}

export const useMessages = (status: InboxStatus = 'active'): UseMessagesState => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<'fetch' | 'generic' | null>(null);

  const fetch = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getInboxMessages(status);
      // error_code 2 means "no messages" — a normal empty result, not an error.
      if ((response.error || response.error_code) && response.error_code !== 2) {
        setError('generic');
      } else {
        setMessages(response.data || []);
      }
    } catch {
      setError('fetch');
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { messages, isLoading, error, refetch: fetch };
};
