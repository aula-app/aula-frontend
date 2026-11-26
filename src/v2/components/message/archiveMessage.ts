import { setMessageStatus } from '@/services/messages';

const ARCHIVED = 3;

export const archiveMessage = (hash_id: string) => setMessageStatus({ message_id: hash_id, status: ARCHIVED });
