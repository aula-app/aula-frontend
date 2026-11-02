import { ICON_TYPE } from '@/v2/components/ui/Icon/Icon';

export type UpdateVariant = 'votes' | 'comments';

export const UPDATE_VARIANTS: UpdateVariant[] = ['votes', 'comments'];

export const VARIANT_ICONS: Record<UpdateVariant, ICON_TYPE> = { votes: 'voting', comments: 'comment' };
