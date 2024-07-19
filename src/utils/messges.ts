export type MessageConsentValues = 'message' | 'announcement' | 'alert';
export const messageConsentValues = ['message', 'announcement', 'alert'] as MessageConsentValues[];

export interface MessageConsentType {
  id: number;
  headline: string;
  body: string;
  consent_text: string;
  consent: null | number;
}
