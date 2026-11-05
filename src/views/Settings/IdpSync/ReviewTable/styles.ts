import { RowKind } from './candidates';

export const CARD = 'rounded-xl border align-middle';
export const PLAIN = 'bg-paper border-current/70';
export const CHIP =
  'rounded-full px-3 py-1 text-xs font-bold whitespace-nowrap border border-current/40 bg-paper hover:bg-surface ' +
  'focus-visible:outline-2 focus-visible:outline-current focus-visible:outline-offset-2';
export const CONTENT = 'px-3 py-2';
export const HOLE =
  'outline-2 outline-dashed outline-current/70 hover:outline-solid hover:bg-current/10 focus-within:outline-solid focus-within:bg-current/10 data-[over]:outline-solid data-[over]:bg-current/10';
export const DIM = 'text-muted';
export const FOCUS = 'focus-visible:outline-2 focus-visible:outline-current focus-visible:outline-offset-2';

const MERGED = 'bg-success text-success-fg border-success-fg/70';
const CREATED = 'bg-info text-info-fg border-info-fg/70';
const UNCHANGED = 'bg-surface text-muted border-current/70';
const PENDING = 'bg-warning text-warning-fg border-warning-fg/70';

const TONE: Record<RowKind, string> = { merge: MERGED, pending: PENDING, create: CREATED, keep: UNCHANGED };

export const toneFor = (kind: RowKind) => TONE[kind];

export const TAG: Record<RowKind, string> = {
  merge: 'bg-success-fg text-success',
  pending: 'bg-warning-fg text-warning',
  create: 'bg-info-fg text-info',
  keep: 'bg-muted text-surface',
};

export const ICON: Record<RowKind, 'check' | 'alert' | 'add' | 'home'> = {
  merge: 'check',
  pending: 'alert',
  create: 'add',
  keep: 'home',
};

export const SOURCE_TEXT: Record<RowKind, string> = {
  merge: 'text-success-fg',
  pending: 'text-warning-fg',
  create: 'text-info-fg',
  keep: 'text-muted',
};
