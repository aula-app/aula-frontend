import { IdeaType } from '@/types/Scopes';
import { toVerdict } from '@/utils';

const VOTING_PHASE = 30;
const RESULTS_PHASE = 40;

/**
 * Ideas still in the running. A rejection ends an idea's run, so from voting on it is
 * out of every count — it can never be voted on, and so can never be decided.
 */
export const inTheRunning = (ideas: IdeaType[], phase: number): IdeaType[] =>
  phase >= VOTING_PHASE ? ideas.filter((idea) => idea.approved !== -1) : ideas;

/**
 * Ideas that have had a decision. Approval and results ask the same question, and
 * differ only in the field that records the answer.
 */
export const countSettled = (ideas: IdeaType[], phase: number): number =>
  ideas.filter((idea) => (phase === RESULTS_PHASE ? toVerdict(idea.is_winner) !== null : idea.approved !== 0)).length;
