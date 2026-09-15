import { IdeaType } from '@/types/Scopes';
import { describe, expect, it } from 'vitest';
import { getPhaseStatus } from './getPhaseStatus';

const idea = (overrides: Partial<IdeaType> = {}) =>
  ({
    approved: 0,
    is_winner: 0,
    number_of_votes: 0,
    number_of_users: 0,
    ...overrides,
  }) as IdeaType;

describe('getPhaseStatus', () => {
  it('has no badge before the approval phase', () => {
    expect(getPhaseStatus({ idea: idea(), phase: '0' })).toBeNull();
    expect(getPhaseStatus({ idea: idea(), phase: '10' })).toBeNull();
  });

  it('reports the moderation decision in the approval phase', () => {
    expect(getPhaseStatus({ idea: idea({ approved: 1 }), phase: '20' })?.label).toContain('approved');
    expect(getPhaseStatus({ idea: idea({ approved: -1 }), phase: '20' })?.label).toContain('rejected');
    expect(getPhaseStatus({ idea: idea(), phase: '20' })?.label).toContain('waiting');
  });

  it('keeps the undecided approval badge in the phase colour', () => {
    expect(getPhaseStatus({ idea: idea(), phase: '20' })?.colors).toBe('bg-approval-light text-approval-fg');
  });

  it('reports the viewer own vote in the voting phase', () => {
    expect(getPhaseStatus({ idea: idea(), phase: '30', vote: 1 })?.label).toContain('votedFor');
    expect(getPhaseStatus({ idea: idea(), phase: '30', vote: 0 })?.label).toContain('votedNeutral');
    expect(getPhaseStatus({ idea: idea(), phase: '30', vote: -1 })?.label).toContain('votedAgainst');
    expect(getPhaseStatus({ idea: idea(), phase: '30', vote: null })?.label).toContain('waiting');
  });

  it('reads an unknown vote as waiting rather than dropping the badge', () => {
    const status = getPhaseStatus({ idea: idea(), phase: '30' });
    expect(status?.label).toContain('waiting');
    expect(status?.colors).toBe('bg-voting-light text-voting-fg');
  });

  it('archives a rejected idea in a muted badge once voting starts', () => {
    const archived = getPhaseStatus({ idea: idea({ approved: -1 }), phase: '30', vote: 1 });
    expect(archived?.label).toContain('rejected');
    expect(archived?.colors).toBe('bg-neutral text-neutral-fg');

    expect(getPhaseStatus({ idea: idea({ approved: -1 }), phase: '40', quorum: 50 })?.colors).toBe(
      'bg-neutral text-neutral-fg'
    );
  });

  it('keeps the approval-phase rejection loud', () => {
    expect(getPhaseStatus({ idea: idea({ approved: -1 }), phase: '20' })?.colors).toBe('bg-error text-error-fg');
  });

  it('leaves ideas unbadged before approval even if flagged rejected', () => {
    expect(getPhaseStatus({ idea: idea({ approved: -1 }), phase: '10' })).toBeNull();
  });

  it('marks winners in the results phase', () => {
    expect(getPhaseStatus({ idea: idea({ is_winner: 1 }), phase: '40', quorum: 50 })?.label).toContain('winner');
  });

  it('weighs turnout against the quorum for non-winners', () => {
    const turnout = idea({ number_of_votes: 6, number_of_users: 10 });
    expect(getPhaseStatus({ idea: turnout, phase: '40', quorum: 50 })?.label).toContain('quorumReached');
    expect(getPhaseStatus({ idea: turnout, phase: '40', quorum: 80 })?.label).toContain('quorumMissed');
  });

  it('does not claim a missed quorum when none is configured', () => {
    expect(getPhaseStatus({ idea: idea({ number_of_votes: 6, number_of_users: 10 }), phase: '40' })?.label).toContain(
      'notSelected'
    );
  });

  it('does not divide by zero when a box has no eligible users', () => {
    expect(getPhaseStatus({ idea: idea(), phase: '40', quorum: 50 })?.label).toContain('quorumMissed');
  });
});
