import { IconType } from '@/components/AppIcon/AppIcon';

export interface MessageType {
  id: number;
  creator_id: number;
  headline: string;
  body: string;
  user_needs_to_consent: number;
  service_id_consent: number;
  consent_text: string;
  language_id: number;
  location: null;
  created: string;
  last_update: string;
  updater_id: number;
  hash_id: string;
  status: number;
}

export interface MessageConsentType {
  id: number;
  headline: string;
  body: string;
  consent_text: string;
  consent: null | number;
}

export interface MessagesResponseType {
  success: Boolean;
  count: Number;
  data: MessageConsentType[];
}

export type MessageTypes = 'message' | 'announcement' | 'alert';
export type MessageConfigsType = Record<MessageTypes, { icon: IconType; color: Record<string, string> }>;

export const messageConsentValues = ['message', 'announcement', 'alert'] as MessageTypes[];
