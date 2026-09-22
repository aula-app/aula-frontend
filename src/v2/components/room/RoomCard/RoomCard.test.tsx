import { RoomType } from '@/types/Scopes';
import { render } from '@testing-library/react';
import { ComponentProps } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import RoomCard from './RoomCard';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, vars?: Record<string, unknown>) => {
      if (vars && 'defaultValue' in vars) return String(vars.var);
      return vars ? `${key}:${JSON.stringify(vars)}` : key;
    },
  }),
}));

const roomWith = (overrides: Partial<RoomType> = {}) =>
  ({
    hash_id: 'r1',
    room_name: 'Klimaschutz',
    description_internal: '',
    ...overrides,
  }) as RoomType;

const renderCard = (props: Partial<ComponentProps<typeof RoomCard>> = {}) =>
  render(
    <MemoryRouter>
      <RoomCard room={roomWith()} {...props} />
    </MemoryRouter>
  );

describe('RoomCard', () => {
  it('names the room and links into its wild ideas', () => {
    const { container } = renderCard();

    expect(container.querySelector('h2')?.textContent).toBe('Klimaschutz');
    expect(container.querySelector('a')?.getAttribute('href')).toBe('/room/r1/phase/0');
  });

  it('falls back to the app name rather than showing a blank heading', () => {
    const { container } = renderCard({ room: roomWith({ room_name: '' }) });

    expect(container.querySelector('h2')?.textContent).toBe('AULA');
  });

  it('passes the counts to the phase bar', () => {
    const { container } = renderCard({ counts: { '0': 15, '40': 20 } });

    expect(container.querySelector('[data-testid="link-to-phase-0"]')?.textContent).toContain('15');
    expect(container.querySelector('[data-testid="link-to-phase-40"]')?.textContent).toContain('20');
  });

  it('leaves no phase current, so a card bar never disables a link', () => {
    const { container } = renderCard();

    expect(container.querySelectorAll('[aria-current]')).toHaveLength(0);
  });
});

describe('RoomCard cover image', () => {
  const drawn = (description: string) => {
    const { container } = renderCard({ room: roomWith({ description_internal: description }) });
    return container.querySelector('svg')!.innerHTML;
  };

  it('draws the image the DI marker names, not the default one', () => {
    expect(drawn('DI:3:0')).not.toBe(drawn('DI:0:0'));
  });

  it('shifts the palette by the second DI number', () => {
    expect(drawn('DI:3:40')).not.toBe(drawn('DI:3:0'));
  });

  it('falls back to the default image when the description is not a DI marker', () => {
    expect(drawn('Just some internal notes')).toBe(drawn('DI:0:0'));
  });

  it('falls back to the default image when the DI numbers are not numbers', () => {
    expect(drawn('DI:x:y')).toBe(drawn('DI:0:0'));
  });
});
