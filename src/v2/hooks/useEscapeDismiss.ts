import { RefObject, useEffect } from 'react';

/**
 * Escape-to-close for a native <dialog>. An Escape that closes a react-aria popover inside the dialog is ignored:
 * react-aria unmounts the popover during keydown, before `cancel` fires, so the check runs in keydown's capture phase.
 */
export const useEscapeDismiss = (dialogRef: RefObject<HTMLDialogElement | null>, onClose?: () => void) => {
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    let popoverWasOpen = false;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') popoverWasOpen = !!dialog.querySelector('[data-trigger]');
    };
    const handleCancel = (e: Event) => {
      e.preventDefault();
      if (popoverWasOpen) {
        popoverWasOpen = false;
        return;
      }
      onClose?.();
    };

    dialog.addEventListener('keydown', handleKeyDown, true);
    dialog.addEventListener('cancel', handleCancel);
    return () => {
      dialog.removeEventListener('keydown', handleKeyDown, true);
      dialog.removeEventListener('cancel', handleCancel);
    };
  }, [dialogRef, onClose]);
};
