import { IdeaType } from '@/types/Scopes';
import { describe, expect, it } from 'vitest';
import { countSettled, inTheRunning } from './countSettled';

const ideas = (...specs: Array<Partial<IdeaType>>) =>
  specs.map((spec) => ({ approved: 0, is_winner: 0, ...spec }) as IdeaType);

describe('inTheRunning', () => {
  it('keeps rejected ideas while approval is still the question', () => {
    expect(inTheRunning(ideas({ approved: -1 }, { approved: 1 }), 20)).toHaveLength(2);
  });

  it('drops rejected ideas from voting on', () => {
    expect(inTheRunning(ideas({ approved: -1 }, { approved: 1 }), 30)).toHaveLength(1);
    expect(inTheRunning(ideas({ approved: -1 }, { approved: 1 }), 40)).toHaveLength(1);
  });
});

describe('countSettled', () => {
  it('counts a rejection as a decision in the approval phase', () => {
    expect(countSettled(ideas({ approved: -1 }, { approved: 1 }, { approved: 0 }), 20)).toBe(2);
  });

  it('reaches every idea in the results phase once the rejected ones are out', () => {
    const all = ideas({ approved: -1 }, { approved: 1, is_winner: 1 }, { approved: 1, is_winner: -1 });
    const running = inTheRunning(all, 40);

    expect(countSettled(running, 40)).toBe(running.length);
  });
});
