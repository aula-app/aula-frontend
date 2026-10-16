import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import PhaseBar from './PhaseBar';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, vars?: Record<string, unknown>) => {
      if (vars && 'defaultValue' in vars) return String(vars.var);
      return vars ? `${key}:${JSON.stringify(vars)}` : key;
    },
  }),
}));

const renderBar = (props: Partial<ComponentProps<typeof PhaseBar>> = {}) =>
  render(
    <MemoryRouter>
      <PhaseBar room="r1" {...props} />
    </MemoryRouter>
  );

const segment = (container: HTMLElement, phase: string) =>
  container.querySelector(`[data-testid="link-to-phase-${phase}"]`)!;

const wrapper = (container: HTMLElement, phase: string) => segment(container, phase).parentElement!;

describe('PhaseBar current phase', () => {
  it('marks the given phase as the page and disables its link', () => {
    const { container } = renderBar({ phase: '20' });

    expect(segment(container, '20').getAttribute('aria-current')).toBe('page');
    expect(segment(container, '20').tagName).toBe('DIV');
    expect(segment(container, '10').tagName).toBe('A');
  });

  it('gives the current phase the room to itself', () => {
    const { container } = renderBar({ phase: '20' });

    expect(wrapper(container, '20').className).toContain('flex-2');
    expect(wrapper(container, '10').className).toContain('flex-1');
  });

  it('leaves every phase navigable when none is current, as on a room card', () => {
    const { container } = renderBar();

    expect(container.querySelectorAll('[aria-current]')).toHaveLength(0);
    expect(container.querySelectorAll('a')).toHaveLength(5);
  });

  it('shares the width evenly when no phase is current, the last phase included', () => {
    const { container } = renderBar();

    expect(container.querySelectorAll('.flex-2')).toHaveLength(0);
    ['0', '10', '20', '30', '40'].forEach((displayPhase) =>
      expect(wrapper(container, displayPhase).className).toContain('flex-1')
    );
  });

  it('still expands a hovered phase with none current, so the names stay reachable', async () => {
    const { container } = renderBar();
    const user = userEvent.setup();

    await user.hover(segment(container, '30'));

    expect(wrapper(container, '30').className).toContain('flex-2');
    expect(wrapper(container, '0').className).not.toContain('flex-2');
  });
});

describe('PhaseBar counts', () => {
  it('shows a number beside each phase it was given one for', () => {
    const { container } = renderBar({ counts: { '0': 15, '10': 10, '20': 8, '30': 2, '40': 20 } });

    expect(segment(container, '0').textContent).toContain('15');
    expect(segment(container, '40').textContent).toContain('20');
  });

  it('leaves a phase blank while its count is still loading', () => {
    const { container } = renderBar({ counts: { '0': 15 } });

    expect(segment(container, '10').textContent).not.toMatch(/\d/);
  });

  it('shows no numbers at all when the caller passes no counts', () => {
    const { container } = renderBar({ phase: '0' });

    const labels = Array.from(container.querySelectorAll('[data-testid^="link-to-phase-"] span')).map(
      (node) => node.textContent
    );
    expect(labels.join('')).not.toMatch(/\d/);
  });

  it('counts ideas in phase 0 and boxes in the rest', () => {
    const { container } = renderBar({ counts: { '0': 15, '10': 10 } });

    expect(segment(container, '0').getAttribute('aria-label')).toContain('v2.scopes.ideas.plural');
    expect(segment(container, '10').getAttribute('aria-label')).toContain('v2.scopes.boxes.plural');
  });

  it('reads a count of one as a singular noun', () => {
    const { container } = renderBar({ counts: { '30': 1 } });

    expect(segment(container, '30').getAttribute('aria-label')).toContain('v2.scopes.boxes.singular');
  });
});

describe('PhaseBar link labels', () => {
  it('names the room, so a grid of cards does not repeat one label', () => {
    const { container } = renderBar({ counts: { '10': 10 }, roomName: 'Klimaschutz' });

    expect(segment(container, '10').getAttribute('aria-label')).toContain('Klimaschutz');
  });

  it('falls back to the move-to-phase label where there is no count', () => {
    const { container } = renderBar({ phase: '0' });

    expect(segment(container, '10').getAttribute('aria-label')).toContain('v2.ui.moveToPhase');
  });
});

describe('PhaseBar in a narrow bar', () => {
  const label = (container: HTMLElement, phase: string) => segment(container, phase).querySelector('span.grid')!;

  it('holds every name collapsed until the bar itself is wide enough for one', () => {
    const { container } = renderBar({ phase: '0', counts: { '0': 3 } });

    expect(label(container, '0').className).toContain('grid-cols-[0fr] @md:grid-cols-[1fr]');
  });
});
