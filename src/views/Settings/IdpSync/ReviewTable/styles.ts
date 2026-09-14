import { RowKind } from './candidates';

export const CARD = 'rounded-xl border align-middle';
export const PLAIN = 'bg-paper border-current/15';
export const CHIP = 'rounded-full px-3 py-1 text-xs font-bold bg-current/10 hover:bg-current/20';
export const CONTENT = 'px-3 py-2';

const SUCCESS = 'bg-success text-success-fg border-success-fg/25';
const INFO = 'bg-info text-info-fg border-info-fg/25';
const WARNING = 'bg-warning text-warning-fg border-warning-fg/25';
const ERROR = 'bg-error text-error-fg border-error-fg/25';

// A pair merges cleanly either way. Anything else costs a person something — an
// empty account, or one nobody can sign in to — while a room just carries on.
const PERSON: Record<RowKind, string> = { merge: SUCCESS, create: WARNING, keep: ERROR };
const ROOM: Record<RowKind, string> = { merge: SUCCESS, create: INFO, keep: WARNING };

export const toneFor = (kind: RowKind, isPerson: boolean) => (isPerson ? PERSON : ROOM)[kind];
