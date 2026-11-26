import { addMessage } from '@/services/messages';
import { GenericResponse } from '@/services/requests';
import { deleteUser, editSelfRestricted } from '@/services/users';
import { MessageType } from '@/types/Scopes';
import { checkPermissions } from '@/utils';
import { archiveMessage } from '@/v2/components/message/archiveMessage';
import { useToast } from '@/v2/hooks';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const REQUEST = 6;

export type RequestType = 'deleteAccount' | 'changeName';
type ChangeableField = 'displayname' | 'realname' | 'username' | 'email';

export const isRequestType = (type?: string): type is RequestType => type === 'deleteAccount' || type === 'changeName';

export const isActionableRequest = (metadata: Record<string, string>) =>
  isRequestType(metadata.type) && checkPermissions('requests', 'status');

/** Stops at the first failing step, so a failed request is never archived as done. */
export const useRequestActions = (message: MessageType, metadata: Record<string, string>, onDone?: () => void) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [pending, setPending] = useState(false);

  const apply = (): Promise<GenericResponse> =>
    metadata.type === 'deleteAccount'
      ? deleteUser(metadata.id)
      : editSelfRestricted({ field: metadata.property as ChangeableField, id: metadata.id, value: metadata.value });

  // `responseTo` instead of `type`, so the reply offers no actions.
  const reply = (text: string) => {
    const fields = Object.entries(metadata)
      .map(([key, value]) => `${key === 'type' ? 'responseTo' : key}: ${value}`)
      .join('\n');
    return addMessage({
      msg_type: REQUEST,
      headline: message.headline,
      body: `\n---\n${fields}\n---\n${text}`,
      target_id: message.creator_id,
    });
  };

  const run = async (steps: (() => Promise<GenericResponse>)[], successMessage: string) => {
    setPending(true);
    try {
      for (const step of steps) {
        const response = await step();
        if (response.error) {
          toast.error(t(response.error));
          return;
        }
      }
      toast.success(successMessage);
      onDone?.();
    } catch {
      toast.error(t('errors.failed'));
    } finally {
      setPending(false);
    }
  };

  const archive = () => archiveMessage(message.hash_id);

  return {
    pending,
    confirm: () => run([apply, () => reply(t('requests.accepted')), archive], t('requests.confirm')),
    reject: () => run([() => reply(t('requests.denied')), archive], t('requests.cancel')),
  };
};
