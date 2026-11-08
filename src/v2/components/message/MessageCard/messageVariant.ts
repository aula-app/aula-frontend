import { ICON_TYPE } from '@/v2/components/ui/Icon/Icon';

export type MessageVariant = 'messages' | 'requests' | 'reports' | 'bugs';

export const MESSAGE_VARIANTS: MessageVariant[] = ['messages', 'requests', 'reports', 'bugs'];

const VARIANT_BY_TYPE: Record<number, MessageVariant> = { 4: 'reports', 5: 'bugs', 6: 'requests' };

export const getMessageVariant = (msg_type: number): MessageVariant => VARIANT_BY_TYPE[msg_type] ?? 'messages';

export const VARIANT_STYLES: Record<
  MessageVariant,
  { icon: ICON_TYPE; iconClass?: string; color: string; hover: string }
> = {
  messages: {
    icon: 'user',
    iconClass: 'rounded-full bg-secondary text-shade p-1',
    color: 'bg-info',
    hover: 'hover:bg-info-active',
  },
  requests: { icon: 'request', color: 'bg-neutral', hover: 'hover:bg-neutral-active' },
  reports: { icon: 'report', color: 'bg-warning', hover: 'hover:bg-warning-active' },
  bugs: { icon: 'bug', color: 'bg-error', hover: 'hover:bg-error-active' },
};
