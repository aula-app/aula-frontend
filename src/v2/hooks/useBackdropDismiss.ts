import { MouseEvent, PointerEvent, useRef } from 'react';

/**
 * Backdrop-click dismissal for a native <dialog>. A click only counts when the press both started and ended on
 * the backdrop: when pointerdown and pointerup land on different elements (e.g. a popover underlay appearing
 * mid-press, or a text-selection drag), the browser dispatches the click on their common ancestor — the dialog.
 */
export const useBackdropDismiss = (onClose?: () => void) => {
  const pressedBackdrop = useRef(false);

  return {
    onPointerDown: (e: PointerEvent<HTMLDialogElement>) => {
      pressedBackdrop.current = e.target === e.currentTarget;
    },
    onClick: (e: MouseEvent<HTMLDialogElement>) => {
      if (onClose && pressedBackdrop.current && e.target === e.currentTarget) onClose();
      pressedBackdrop.current = false;
    },
  };
};
