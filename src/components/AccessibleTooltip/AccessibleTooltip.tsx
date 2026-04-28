import { Tooltip, TooltipProps } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

/**
 * WCAG 1.4.13 – Content on Hover or Focus compliant tooltip.
 *
 * Extends MUI Tooltip with Escape-key dismissal so that keyboard and pointer
 * users can hide the tooltip without moving focus or the pointer away from
 * the trigger element (dismissible requirement).
 *
 * MUI Tooltip already satisfies the other two requirements out-of-the-box:
 *  - Hoverable: the pointer can move from trigger into the tooltip content.
 *  - Persistent: content stays until the pointer/focus leaves or it's dismissed.
 *
 * Pass `open` explicitly to keep full controlled-mode behaviour (e.g. VotingQuorum).
 */
const AccessibleTooltip = ({ children, onOpen, onClose, open: openProp, ...props }: TooltipProps) => {
  const isControlled = openProp !== undefined;
  const [openState, setOpenState] = useState(false);

  const open = isControlled ? openProp : openState;

  const handleOpen = useCallback(
    (event: React.SyntheticEvent) => {
      if (!isControlled) setOpenState(true);
      onOpen?.(event);
    },
    [isControlled, onOpen]
  );

  const handleClose = useCallback(
    (event: React.SyntheticEvent | Event) => {
      if (!isControlled) setOpenState(false);
      onClose?.(event as React.SyntheticEvent);
    },
    [isControlled, onClose]
  );

  // WCAG 1.4.13 – Dismissible: close on Escape without moving focus or pointer.
  //
  // Registered in CAPTURE phase so it fires before any bubble-phase handlers
  // (e.g. AccessibleDialog's useEscapeKey). stopImmediatePropagation prevents
  // those handlers from also closing a parent dialog when the intent was only
  // to dismiss this tooltip.
  useEffect(() => {
    if (!open || isControlled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation();
        setOpenState(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => document.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [open, isControlled]);

  return (
    <Tooltip {...props} open={open} onOpen={handleOpen} onClose={handleClose}>
      {children}
    </Tooltip>
  );
};

export default AccessibleTooltip;
