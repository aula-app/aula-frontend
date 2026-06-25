import { useLayoutEffect, useState } from 'react';

export type XZone = 'left' | 'center' | 'right';
export type YZone = 'top' | 'middle' | 'bottom';

/** Walk up the DOM to find the nearest ancestor that clips overflow. Falls back to the viewport. */
export function getClippingRect(el: HTMLElement): DOMRect {
  let parent = el.parentElement;
  while (parent && parent !== document.documentElement) {
    const { overflow, overflowX, overflowY } = getComputedStyle(parent);
    if (/auto|scroll|hidden|clip/.test(overflow + overflowX + overflowY)) {
      return parent.getBoundingClientRect();
    }
    parent = parent.parentElement;
  }
  return new DOMRect(0, 0, window.innerWidth, window.innerHeight);
}

/** Divide the clipping container into thirds to classify where the trigger sits. */
export function getZones(el: HTMLElement, rect: DOMRect): { x: XZone; y: YZone } {
  const container = getClippingRect(el);
  const cx = (rect.left + rect.right) / 2;
  const cy = (rect.top + rect.bottom) / 2;

  const x: XZone =
    cx < container.left + container.width / 3
      ? 'left'
      : cx > container.left + (2 * container.width) / 3
        ? 'right'
        : 'center';

  const y: YZone =
    cy < container.top + container.height / 3
      ? 'top'
      : cy > container.top + (2 * container.height) / 3
        ? 'bottom'
        : 'middle';

  return { x, y };
}

const cornerClasses: Record<YZone, Record<XZone, string>> = {
  top:    { right: 'rounded-tr-none', left: 'rounded-tl-none', center: '' },
  bottom: { right: 'rounded-br-none', left: 'rounded-bl-none', center: '' },
  middle: { right: '',                left: '',                 center: '' },
};

const originClasses: Record<YZone, Record<XZone, string>> = {
  top:    { right: 'origin-top-right',    left: 'origin-top-left',    center: 'origin-top' },
  bottom: { right: 'origin-bottom-right', left: 'origin-bottom-left', center: 'origin-bottom' },
  middle: { right: 'origin-right',        left: 'origin-left',        center: 'origin-center' },
};

// Horizontal position without animation — shared standard.
// Consumers may add slide-in translates on top (e.g. Tooltip).
const horizontalClasses: Record<XZone, string> = {
  left:   'left-1/2',   // near left  → panel starts at wrapper center, extends right
  center: '',
  right:  'right-1/2',  // near right → panel ends at wrapper center, extends left
};

/** Shared placement hook: returns zones and all position classes. */
export function usePlacement(ref: { current: HTMLElement | null }) {
  // `ref.current` is null on the first render (the ref attaches after the DOM mounts), so the
  // measurement below would fall back to a zeroed DOMRect and misplace the panel below the trigger.
  // Force one re-measure in a layout effect — after the ref is attached but before paint — so the
  // placement is correct on first paint instead of only after a later re-render.
  const [, remeasure] = useState(0);
  useLayoutEffect(() => remeasure((n) => n + 1), []);

  const el = ref.current;
  const rect = el?.getBoundingClientRect() ?? new DOMRect();
  const container = getClippingRect(el ?? document.body);
  const zones = getZones(el ?? document.body, rect);
  const { x, y } = zones;

  const verticalClass =
    y === 'bottom' ? 'bottom-[calc(100%+0.25rem)]' : 'top-[calc(100%+0.25rem)]';

  return {
    zones,
    verticalClass,
    horizontalClass: horizontalClasses[x],
    cornerClass: cornerClasses[y][x],
    originClass: originClasses[y][x],
    containerWidth: container.width,
  };
}
