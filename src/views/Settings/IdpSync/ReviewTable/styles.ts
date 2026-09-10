import { RowKind } from './candidates';

export const CARD = 'rounded-xl border align-middle';
export const PLAIN = 'bg-paper border-current/15';
export const CHIP = 'rounded-full px-3 py-1 text-xs font-bold bg-current/10 hover:bg-current/20';
export const CONTENT = 'px-3 py-2';

export const TONE: Record<RowKind, string> = {
  merge: 'bg-success text-success-fg border-success-fg/25',
  create: 'bg-info text-info-fg border-info-fg/25',
  keep: 'bg-error text-error-fg border-error-fg/25',
};
