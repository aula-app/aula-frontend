import { useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

type XZone = 'left' | 'center' | 'right';
type YZone = 'top' | 'middle' | 'bottom';
type Side = XZone | YZone;

// Divide viewport into thirds to classify where the element sits
function getZones(rect: DOMRect): { x: XZone; y: YZone } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const cx = (rect.left + rect.right) / 2;
  const cy = (rect.top + rect.bottom) / 2;

  const x: XZone = cx < vw / 3 ? 'left' : cx > 2 * (vw / 3) ? 'right' : 'center';
  const y: YZone = cy < vh / 3 ? 'top' : cy > 2 * (vh / 3) ? 'bottom' : 'middle';

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

export function useTooltipPlacement(ref: React.RefObject<HTMLButtonElement>) {
  const position = getZones(ref.current?.getBoundingClientRect() ?? new DOMRect());

  const horizontal = position.x;
  const vertical = position.x === 'center' && position.y === 'middle' ? 'bottom' : position.y;

  return {
    placementClass: twMerge(positionClass[vertical], positionClass[horizontal], cornerClass[vertical][horizontal]),
  };
}
