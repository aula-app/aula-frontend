import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import DefaultImage from './DefaultImage';

let darkMode = false;
vi.mock('@/store', () => ({ useAppStore: () => [{ darkMode }] }));

const IMAGE_COUNT = 8;

const fillsOf = (image: number, shift = 0) => {
  const { container } = render(<DefaultImage image={image} shift={shift} />);
  const shapes = container.querySelectorAll('path, circle, rect, polygon, ellipse');
  return [...shapes].map((shape) => shape.getAttribute('fill'));
};

beforeEach(() => {
  darkMode = false;
});

describe('DefaultImage palette', () => {
  // A token the artwork references but the palette does not define renders with no fill
  // attribute at all, which the browser paints black — invisible on a dark ground.
  it.each([...Array(IMAGE_COUNT).keys()])('resolves a colour for every shape of image %i', (image) => {
    expect(fillsOf(image).filter((fill) => !fill)).toHaveLength(0);
  });

  it('resolves every shape in dark mode too', () => {
    darkMode = true;

    for (let image = 0; image < IMAGE_COUNT; image++) {
      expect(fillsOf(image).filter((fill) => !fill)).toHaveLength(0);
    }
  });

  it('shifts the hues so two rooms never look alike', () => {
    const plain = fillsOf(0, 0);
    const shifted = fillsOf(0, 45);

    expect(shifted).not.toEqual(plain);
    expect(plain).toContain('hsl(132, 55%, 78%)');
    expect(shifted).toContain('hsl(87, 55%, 78%)');
  });

  it('drops the ground onto a dark ground in dark mode', () => {
    expect(fillsOf(0)).toContain('hsl(132, 55%, 78%)');

    darkMode = true;
    expect(fillsOf(0)).toContain('hsl(132, 28%, 16%)');
  });

  it('flips the linework from black to light, so detail survives the dark ground', () => {
    expect(fillsOf(0)).toContain('hsl(0, 0%, 0%)');

    darkMode = true;
    const dark = fillsOf(0);
    expect(dark).toContain('hsl(0, 8%, 78%)');
    expect(dark).not.toContain('hsl(0, 0%, 0%)');
  });

  it('keeps the same hue in both modes, so a room stays recognisable', () => {
    const hues = (fills: (string | null)[]) =>
      new Set(fills.map((fill) => fill?.match(/hsl\((-?\d+)/)?.[1]).filter(Boolean));

    darkMode = false;
    const light = hues(fillsOf(0));
    darkMode = true;
    const dark = hues(fillsOf(0));

    expect([...dark]).toEqual([...light]);
  });
});
