import { RowKind } from './candidates';

export const CARD = 'rounded-xl border align-middle';
export const PLAIN = 'bg-paper border-current/15';
export const CHIP = 'rounded-full px-3 py-1 text-xs font-bold bg-current/10 hover:bg-current/20';
export const CONTENT = 'px-3 py-2';
export const HOLE =
  'outline-2 outline-dashed outline-current/50 hover:outline-solid hover:bg-current/10 focus-within:outline-solid focus-within:bg-current/10 data-[over]:outline-solid data-[over]:bg-current/10';

const SUCCESS = 'bg-success text-success-fg border-success-fg/25';
const INFO = 'bg-info text-info-fg border-info-fg/25';
const WARNING = 'bg-warning text-warning-fg border-warning-fg/25';
const ERROR = 'bg-error text-error-fg border-error-fg/25';
/** The merge tone, outlined: proposed, not yet confirmed. */
const PENDING = 'bg-paper text-success-fg border-2 border-dashed border-success-fg/60';

const PERSON: Record<RowKind, string> = { merge: SUCCESS, pending: PENDING, create: WARNING, keep: ERROR };
const SOURCE: Record<RowKind, string> = { merge: SUCCESS, pending: PENDING, create: INFO, keep: WARNING };

export const toneFor = (kind: RowKind, isPerson: boolean) => (isPerson ? PERSON : SOURCE)[kind];

export const SOURCE_TEXT: Record<RowKind, string> = {
  merge: 'text-success-fg',
  pending: 'text-success-fg opacity-70',
  create: 'text-info-fg',
  keep: 'text-warning-fg',
};
