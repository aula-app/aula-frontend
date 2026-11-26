import { useCallback, useLayoutEffect, useState } from 'react';

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
  top: { right: 'rounded-tr-none', left: 'rounded-tl-none', center: '' },
  bottom: { right: 'rounded-br-none', left: 'rounded-bl-none', center: '' },
  middle: { right: 'rounded-tr-none', left: 'rounded-tl-none', center: '' },
};

const originClasses: Record<YZone, Record<XZone, string>> = {
  top: { right: 'origin-top-right', left: 'origin-top-left', center: 'origin-top' },
  bottom: { right: 'origin-bottom-right', left: 'origin-bottom-left', center: 'origin-bottom' },
  middle: { right: 'origin-right', left: 'origin-left', center: 'origin-center' },
};

// Horizontal position without animation — shared standard.
// Consumers may add slide-in translates on top (e.g. Tooltip).
const horizontalClasses: Record<XZone, string> = {
  left: 'left-1/2', // near left  → panel starts at wrapper center, extends right
  center: '',
  right: 'right-1/2', // near right → panel ends at wrapper center, extends left
};

const GAP = 8;

interface Measurement {
  zones: { x: XZone; y: YZone };
  containerWidth: number;
  availableHeight: number;
}

function measure(el: HTMLElement | null): Measurement {
  const rect = el?.getBoundingClientRect() ?? new DOMRect();
  const container = getClippingRect(el ?? document.body);
  const zones = getZones(el ?? document.body, rect);
  const availableHeight = Math.max(
    0,
    (zones.y === 'bottom' ? rect.top - container.top : container.bottom - rect.bottom) - GAP
  );
  return { zones, containerWidth: container.width, availableHeight };
}

const isSameMeasurement = (a: Measurement, b: Measurement) =>
  a.zones.x === b.zones.x &&
  a.zones.y === b.zones.y &&
  a.containerWidth === b.containerWidth &&
  a.availableHeight === b.availableHeight;

/** Shared placement hook: returns zones and all position classes. */
export function usePlacement(ref: { current: HTMLElement | null }) {
  // Refs can't be read during render, so measure in a layout effect (after the ref attaches,
  // before paint) and keep the previous state when nothing changed to avoid a render loop.
  const [measurement, setMeasurement] = useState(() => measure(null));
  const remeasure = useCallback(() => {
    const next = measure(ref.current);
    setMeasurement((prev) => (isSameMeasurement(prev, next) ? prev : next));
  }, [ref]);

  useLayoutEffect(() => {
    remeasure();
  });

  useLayoutEffect(() => {
    // The trigger can move/resize after mount (e.g. it lives in a Collapse that expands, so its
    // box animates 0→full height). Re-measure on every resize so placement tracks the final
    // geometry instead of the collapsed geometry captured at mount.
    const node = ref.current;
    if (!node || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(remeasure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, remeasure]);

  const { zones, containerWidth, availableHeight } = measurement;
  const { x, y } = zones;
  const verticalClass = y === 'bottom' ? 'bottom-[calc(100%+0.25rem)]' : 'top-[calc(100%+0.25rem)]';

  return {
    zones,
    verticalClass,
    horizontalClass: horizontalClasses[x],
    cornerClass: cornerClasses[y][x],
    originClass: originClasses[y][x],
    containerWidth,
    availableHeight,
  };
}
