import { BoxType } from '@/types/Scopes';
import { render } from '@testing-library/react';
import { ComponentProps } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import BoxCard from './BoxCard';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, vars?: Record<string, unknown>) => (vars ? `${key}:${JSON.stringify(vars)}` : key),
  }),
}));
vi.mock('@/utils', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/utils')>()),
  checkPermissions: () => true,
}));
vi.mock('@/v2/components/ui/MoreOptions', () => ({ default: () => null }));
vi.mock('@/v2/components/ui/Markdown', () => ({ default: () => null }));

const boxAt = (phase_id: number) =>
  ({
    hash_id: 'b1',
    name: 'A box',
    description_public: '',
    room_hash_id: 'r1',
    ideas_num: 5,
    created: '2026-01-01',
    phase_start: '2026-01-01',
    phase_id: String(phase_id),
  }) as unknown as BoxType;

const renderCard = (phase_id: number, props: Partial<ComponentProps<typeof BoxCard>> = {}) =>
  render(
    <MemoryRouter>
      <BoxCard box={boxAt(phase_id)} {...props} />
    </MemoryRouter>
  );

const bar = (container: HTMLElement) => container.querySelector('[role="progressbar"]');

describe('BoxCard approval progress', () => {
  it('reports how far the review has got during approval', () => {
    const { container } = renderCard(20, { approval: { reviewed: 3, total: 5 } });

    expect(bar(container)?.getAttribute('aria-valuenow')).toBe('60');
    expect(bar(container)?.getAttribute('aria-label')).toContain('v2.scopes.boxes.reviewed');
  });

  it('draws a full bar once every idea has been decided', () => {
    const { container } = renderCard(20, { approval: { reviewed: 5, total: 5 } });

    expect(bar(container)?.getAttribute('aria-valuenow')).toBe('100');
  });

  it('draws nothing when the caller cannot supply the counts', () => {
    const { container } = renderCard(20);

    expect(bar(container)).toBeNull();
  });

  it('draws nothing for an empty box, which has no review to report', () => {
    const { container } = renderCard(20, { approval: { reviewed: 0, total: 0 } });

    expect(bar(container)).toBeNull();
  });

  it('leaves the countdown alone in phases that have one', () => {
    const { container } = renderCard(10, { approval: { reviewed: 3, total: 5 } });

    expect(bar(container)?.getAttribute('aria-label')).toContain('phases.');
  });
});
