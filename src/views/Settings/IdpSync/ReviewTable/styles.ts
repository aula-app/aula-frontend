import { RowKind } from './candidates';

export const CARD = 'rounded-xl border align-middle';
export const PLAIN = 'bg-paper border-current/70';
/** bg-paper, not a tint of the card: a tint of the text colour drops below 4.5:1 in dark mode. */
export const CHIP = 'rounded-full px-3 py-1 text-xs font-bold border border-current/40 bg-paper hover:bg-surface';
export const CONTENT = 'px-3 py-2';
export const HOLE =
  'outline-2 outline-dashed outline-current/70 hover:outline-solid hover:bg-current/10 focus-within:outline-solid focus-within:bg-current/10 data-[over]:outline-solid data-[over]:bg-current/10';
/** Secondary text: an opacity step would take the tinted cards under 4.5:1. */
export const DIM = 'text-muted';

/** Outcomes, not severities: amber and red are left to real problems. */
const MERGED = 'bg-success text-success-fg border-success-fg/70';
const CREATED = 'bg-info text-info-fg border-info-fg/70';
const UNCHANGED = 'bg-surface text-muted border-current/70';
/** The merge tone, unfilled: proposed, not yet confirmed. */
const PENDING = 'bg-paper text-success-fg border-2 border-dashed border-success-fg/70';

const TONE: Record<RowKind, string> = { merge: MERGED, pending: PENDING, create: CREATED, keep: UNCHANGED };

export const toneFor = (kind: RowKind) => TONE[kind];

export const ICON: Record<RowKind, 'check' | 'about' | 'add' | 'home'> = {
  merge: 'check',
  pending: 'about',
  create: 'add',
  keep: 'home',
};

export const SOURCE_TEXT: Record<RowKind, string> = {
  merge: 'text-success-fg',
  pending: 'text-success-fg',
  create: 'text-info-fg',
  keep: 'text-muted',
};

/** Hollow for `pending`, as its card is: colour alone does not separate it from `merge`. */
export const DOT: Record<RowKind, string> = {
  merge: 'bg-current',
  pending: 'border-2 border-current',
  create: 'bg-current',
  keep: 'bg-current',
};
