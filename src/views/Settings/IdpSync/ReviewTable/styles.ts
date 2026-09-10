import { RowKind } from './candidates';

export const CARD = 'rounded-xl border align-middle';
export const PLAIN = 'bg-paper border-current/15';
export const CHIP = 'rounded-full px-3 py-1 text-xs font-bold bg-current/10 hover:bg-current/20';
export const CONTENT = 'px-3 py-2';

const TONE: Record<RowKind, string> = {
  merge: 'bg-success text-success-fg border-success-fg/25',
  create: 'bg-info text-info-fg border-info-fg/25',
  keep: 'bg-error text-error-fg border-error-fg/25',
};

const ROOM_KEEP = 'bg-warning text-warning-fg border-warning-fg/25';

/** An unmatched person can no longer sign in; an unmatched room stays reachable. */
export const toneFor = (kind: RowKind, isPerson: boolean) => (kind === 'keep' && !isPerson ? ROOM_KEEP : TONE[kind]);
