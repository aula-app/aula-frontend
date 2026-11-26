import { IdeaType } from '@/types/Scopes';
import { toVerdict } from '@/utils';

const VOTING_PHASE = 30;
const RESULTS_PHASE = 40;

/** From voting on, rejected ideas are out of every count. */
export const inTheRunning = (ideas: IdeaType[], phase: number): IdeaType[] =>
  phase >= VOTING_PHASE ? ideas.filter((idea) => idea.approved !== -1) : ideas;

export const countSettled = (ideas: IdeaType[], phase: number): number =>
  ideas.filter((idea) => (phase === RESULTS_PHASE ? toVerdict(idea.is_winner) !== null : idea.approved !== 0)).length;
