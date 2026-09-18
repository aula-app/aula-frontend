import { IdeaType } from '@/types/Scopes';
import { toVerdict } from '@/utils';

const RESULTS_PHASE = 40;

/**
 * Ideas that have had a decision. Approval and results ask the same question, and
 * differ only in the field that records the answer.
 */
export const countSettled = (ideas: IdeaType[], phase: number): number =>
  ideas.filter((idea) => (phase === RESULTS_PHASE ? toVerdict(idea.is_winner) !== null : idea.approved !== 0)).length;
