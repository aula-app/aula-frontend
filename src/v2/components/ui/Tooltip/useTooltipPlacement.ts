import { twMerge } from 'tailwind-merge';

type XZone = 'left' | 'center' | 'right';
type YZone = 'top' | 'middle' | 'bottom';
type Side = XZone | YZone;

// Walk up the DOM to find the nearest ancestor that clips overflow.
// Falls back to the viewport if none is found.
function getClippingRect(el: HTMLElement): DOMRect {
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

// Divide the clipping container into thirds to classify where the trigger sits
function getZones(el: HTMLElement, rect: DOMRect): { x: XZone; y: YZone } {
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

const positionClass: Record<Side, string> = {
  top: 'top-[calc(100%+0.25rem)] -translate-y-3', // near top    → below,  slides down
  middle: '', // vertically centered on trigger
  bottom: 'bottom-[calc(100%+0.25rem)] translate-y-3', // near bottom → above,  slides up
  left: 'left-[calc(100%+0.25rem)] -translate-x-3', // near left   → right,  slides in from left
  center: '', // horizontally centered on trigger
  right: 'right-[calc(100%+0.25rem)] translate-x-3', // near right  → left,   slides in from right
};

const cornerClass: Record<YZone, Record<XZone, string>> = {
  top: { right: 'rounded-tr-none', left: 'rounded-tl-none', center: '' },
  bottom: { right: 'rounded-br-none', left: 'rounded-bl-none', center: '' },
  middle: { left: '', right: '', center: '' },
};

export function useTooltipPlacement(ref: React.RefObject<HTMLElement>) {
  const el = ref.current;
  const rect = el?.getBoundingClientRect() ?? new DOMRect();
  const container = getClippingRect(el ?? document.body);
  const position = getZones(el ?? document.body, rect);

  const horizontal = position.x;
  const vertical = position.x === 'center' && position.y === 'middle' ? 'bottom' : position.y;

  return {
    placementClass: twMerge(positionClass[vertical], positionClass[horizontal], cornerClass[vertical][horizontal]),
    containerWidth: container.width,
  };
}
